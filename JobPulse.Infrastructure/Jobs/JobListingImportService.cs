using System.Globalization;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;
using JobPulse.Application.Jobs;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Jobs;

public sealed class JobListingImportService : IJobListingImportService
{
    private static readonly string[] RequiredColumns =
    [
        "Title",
        "CompanyName",
        "Technology",
        "Location",
        "ExperienceRange",
        "Source",
        "SourceJobId",
        "PostedDate"
    ];

    private static readonly string[] StrictlyRequiredRowFields =
    [
        "Title",
        "CompanyName",
        "Technology",
        "Location",
        "ExperienceRange",
        "Source",
        "SourceJobId"
    ];

    private const int MaximumTitleLength = 300;
    private const int MaximumCompanyNameLength = 200;
    private const int MaximumSourceJobIdLength = 200;
    private const int DuplicateQueryChunkSize = 500;

    private readonly JobPulseDbContext _dbContext;

    public JobListingImportService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<JobListingImportSummary> ImportCsvAsync(
        Stream csvData,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(csvData);

        var batch = new JobImportBatch
        {
            StartedAt = DateTimeOffset.UtcNow,
            Status = JobImportBatchStatuses.Started
        };
        _dbContext.JobImportBatches.Add(batch);
        await _dbContext.SaveChangesAsync(cancellationToken);

        try
        {
            var rows = await ReadRowsAsync(csvData, cancellationToken);
            if (rows.Count == 0)
            {
                batch.CompletedAt = DateTimeOffset.UtcNow;
                batch.Status = JobImportBatchStatuses.Completed;
                batch.TotalRows = 0;
                batch.ImportedRows = 0;
                batch.SkippedRows = 0;
                batch.DuplicateRows = 0;
                batch.InvalidRows = 0;
                await _dbContext.SaveChangesAsync(cancellationToken);

                return new JobListingImportSummary(0, 0, 0, 0, 0, Array.Empty<JobListingImportError>())
                {
                    ImportBatchId = batch.Id
                };
            }

            var technologies = await _dbContext.Technologies
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            var technologiesByName = technologies.ToDictionary(technology => technology.Name, StringComparer.OrdinalIgnoreCase);

            var locations = await _dbContext.Locations
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            var locationsByCity = locations
                .GroupBy(location => location.City, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(group => group.Key, group => group.ToArray(), StringComparer.OrdinalIgnoreCase);

            var experienceRanges = await _dbContext.ExperienceRanges
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            var experienceRangesByLabel = experienceRanges
                .ToDictionary(experience => experience.Label, StringComparer.OrdinalIgnoreCase);

            var sources = await _dbContext.JobListingSources.ToListAsync(cancellationToken);
            var sourcesByName = sources.ToDictionary(source => source.Name, StringComparer.OrdinalIgnoreCase);

            var firstSourceName = rows.FirstOrDefault(r => !string.IsNullOrWhiteSpace(r.Get("Source")))?.Get("Source");
            if (firstSourceName is not null && sourcesByName.TryGetValue(firstSourceName, out var matchedSource))
            {
                batch.SourceId = matchedSource.Id;
            }

            var errors = new List<JobListingImportError>();
            var candidates = new List<ValidatedImportRow>();
            var invalidRows = 0;

            void AddInvalidRow(int rowNumber, string reason)
            {
                invalidRows++;
                errors.Add(new JobListingImportError(rowNumber, reason));
            }

            foreach (var row in rows)
            {
                cancellationToken.ThrowIfCancellationRequested();

                if (row.IsMalformed)
                {
                    AddInvalidRow(row.RowNumber, "CSV row is malformed");
                    continue;
                }

                var emptyRequiredField = StrictlyRequiredRowFields.FirstOrDefault(column => string.IsNullOrWhiteSpace(row.Get(column)));
                if (emptyRequiredField is not null)
                {
                    AddInvalidRow(row.RowNumber, $"{emptyRequiredField} is required");
                    continue;
                }

                var title = row.Get("Title")!;
                var companyName = row.Get("CompanyName")!;
                var technologyName = row.Get("Technology")!;
                var locationName = row.Get("Location")!;
                var experienceLabel = row.Get("ExperienceRange")!;
                var sourceName = row.Get("Source")!;
                var sourceJobId = row.Get("SourceJobId")!;
                var postedDateText = row.Get("PostedDate");

                if (title.Length > MaximumTitleLength)
                {
                    AddInvalidRow(row.RowNumber, "Title exceeds the maximum length of 300 characters");
                    continue;
                }

                if (companyName.Length > MaximumCompanyNameLength)
                {
                    AddInvalidRow(row.RowNumber, "CompanyName exceeds the maximum length of 200 characters");
                    continue;
                }

                if (sourceJobId.Length > MaximumSourceJobIdLength)
                {
                    AddInvalidRow(row.RowNumber, "SourceJobId exceeds the maximum length of 200 characters");
                    continue;
                }

                DateTime? postedAtUtc = null;
                var isIncomplete = false;

                if (string.IsNullOrWhiteSpace(postedDateText))
                {
                    isIncomplete = true;
                }
                else
                {
                    if (!DateTimeOffset.TryParse(
                            postedDateText,
                            CultureInfo.InvariantCulture,
                            DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                            out var parsedPostedAt))
                    {
                        AddInvalidRow(row.RowNumber, "PostedDate is invalid");
                        continue;
                    }

                    postedAtUtc = parsedPostedAt.UtcDateTime;
                }

                var explicitStatus = row.Get("DataQualityStatus");
                if (!string.IsNullOrWhiteSpace(explicitStatus))
                {
                    if (string.Equals(explicitStatus, JobDataQualityStatus.Invalid, StringComparison.OrdinalIgnoreCase))
                    {
                        AddInvalidRow(row.RowNumber, "Record is marked as invalid");
                        continue;
                    }

                    if (string.Equals(explicitStatus, JobDataQualityStatus.Incomplete, StringComparison.OrdinalIgnoreCase))
                    {
                        isIncomplete = true;
                    }
                }

                if (!technologiesByName.TryGetValue(technologyName, out var technology))
                {
                    AddInvalidRow(row.RowNumber, $"Technology '{technologyName}' was not found");
                    continue;
                }

                if (!locationsByCity.TryGetValue(locationName, out var matchingLocations))
                {
                    AddInvalidRow(row.RowNumber, $"Location '{locationName}' was not found");
                    continue;
                }

                if (matchingLocations.Length > 1)
                {
                    AddInvalidRow(row.RowNumber, $"Location '{locationName}' is ambiguous");
                    continue;
                }

                if (!experienceRangesByLabel.TryGetValue(experienceLabel, out var experienceRange))
                {
                    AddInvalidRow(row.RowNumber, $"ExperienceRange '{experienceLabel}' was not found");
                    continue;
                }

                if (!sourcesByName.TryGetValue(sourceName, out var source))
                {
                    AddInvalidRow(row.RowNumber, $"Source '{sourceName}' was not found");
                    continue;
                }

                if (!source.IsActive)
                {
                    AddInvalidRow(row.RowNumber, $"Source '{sourceName}' is inactive");
                    continue;
                }

                var dataQualityStatus = isIncomplete ? JobDataQualityStatus.Incomplete : JobDataQualityStatus.Valid;
                var jobUrl = row.Get("JobUrl");
                var workMode = row.Get("WorkMode");
                var employmentType = row.Get("EmploymentType");
                var description = row.Get("Description");
                decimal? salaryMin = decimal.TryParse(row.Get("SalaryMin"), CultureInfo.InvariantCulture, out var sMin) ? sMin : null;
                decimal? salaryMax = decimal.TryParse(row.Get("SalaryMax"), CultureInfo.InvariantCulture, out var sMax) ? sMax : null;

                candidates.Add(new ValidatedImportRow(
                    row.RowNumber,
                    title,
                    companyName,
                    technology.Id,
                    matchingLocations[0].Id,
                    experienceRange.Id,
                    source.Id,
                    sourceJobId,
                    postedAtUtc,
                    dataQualityStatus,
                    jobUrl,
                    workMode,
                    employmentType,
                    salaryMin,
                    salaryMax,
                    description));
            }

            var importTime = DateTimeOffset.UtcNow;
            var existingListings = await FindExistingListingsAsync(candidates, cancellationToken);
            var existingByKey = existingListings.ToDictionary(
                listing => new DuplicateKey(listing.JobListingSourceId, listing.SourceIdentifier!.ToUpperInvariant()));
            var seenKeys = new HashSet<DuplicateKey>();
            var listingsToAdd = new List<JobListing>();
            var duplicateRows = 0;

            foreach (var candidate in candidates)
            {
                var key = new DuplicateKey(candidate.SourceId, candidate.SourceJobId.ToUpperInvariant());
                if (!seenKeys.Add(key))
                {
                    duplicateRows++;
                    continue;
                }

                if (existingByKey.TryGetValue(key, out var existingListing))
                {
                    existingListing.LastSeenAt = importTime;
                    if (existingListing.DataQualityStatus == JobDataQualityStatus.Incomplete &&
                        candidate.DataQualityStatus == JobDataQualityStatus.Valid)
                    {
                        existingListing.DataQualityStatus = JobDataQualityStatus.Valid;
                        existingListing.OriginalPostedDateUtc ??= candidate.PostedDateUtc;
                    }
                    sources.Single(source => source.Id == candidate.SourceId).LastSuccessfulCollectionAt = importTime;
                    duplicateRows++;
                    continue;
                }

                listingsToAdd.Add(new JobListing
                {
                    Title = candidate.Title,
                    CompanyName = candidate.CompanyName,
                    SourceIdentifier = candidate.SourceJobId,
                    OriginalPostedDateUtc = candidate.PostedDateUtc,
                    CollectedAtUtc = importTime.UtcDateTime,
                    LastSeenAt = importTime,
                    DataQualityStatus = candidate.DataQualityStatus,
                    TechnologyId = candidate.TechnologyId,
                    LocationId = candidate.LocationId,
                    ExperienceRangeId = candidate.ExperienceRangeId,
                    JobListingSourceId = candidate.SourceId,
                    JobUrl = candidate.JobUrl,
                    WorkMode = candidate.WorkMode,
                    EmploymentType = candidate.EmploymentType,
                    SalaryMin = candidate.SalaryMin,
                    SalaryMax = candidate.SalaryMax,
                    Description = candidate.Description
                });
                sources.Single(source => source.Id == candidate.SourceId).LastSuccessfulCollectionAt = importTime;
            }

            if (batch.SourceId is null && candidates.Count > 0)
            {
                batch.SourceId = candidates[0].SourceId;
            }

            if (listingsToAdd.Count > 0)
            {
                _dbContext.JobListings.AddRange(listingsToAdd);
            }

            var skippedRows = invalidRows + duplicateRows;
            batch.TotalRows = rows.Count;
            batch.ImportedRows = listingsToAdd.Count;
            batch.DuplicateRows = duplicateRows;
            batch.InvalidRows = invalidRows;
            batch.SkippedRows = skippedRows;
            batch.Status = JobImportBatchStatuses.Completed;
            batch.CompletedAt = DateTimeOffset.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new JobListingImportSummary(
                rows.Count,
                listingsToAdd.Count,
                skippedRows,
                duplicateRows,
                invalidRows,
                errors)
            {
                ImportBatchId = batch.Id
            };
        }
        catch (Exception ex)
        {
            foreach (var entry in _dbContext.ChangeTracker.Entries().Where(e => e.Entity != batch).ToList())
            {
                entry.State = EntityState.Detached;
            }

            batch.Status = JobImportBatchStatuses.Failed;
            batch.CompletedAt = DateTimeOffset.UtcNow;
            batch.ErrorMessage = ex.Message;

            try
            {
                await _dbContext.SaveChangesAsync(CancellationToken.None);
            }
            catch
            {
                // Best-effort saving failure status to audit batch
            }

            throw;
        }
    }

    private static async Task<List<ParsedImportRow>> ReadRowsAsync(
        Stream csvData,
        CancellationToken cancellationToken)
    {
        var malformedRows = new HashSet<int>();
        var configuration = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            IgnoreBlankLines = true,
            TrimOptions = TrimOptions.Trim,
            MissingFieldFound = null,
            BadDataFound = args => malformedRows.Add(checked((int)args.Context.Parser!.Row))
        };

        using var textReader = new StreamReader(csvData, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, leaveOpen: true);
        using var csv = new CsvReader(textReader, configuration);
        if (!await csv.ReadAsync())
        {
            return [];
        }

        if (!csv.ReadHeader() || csv.HeaderRecord is null)
        {
            return [];
        }

        var headers = csv.HeaderRecord;
        var missingHeaders = RequiredColumns
            .Where(requiredColumn => !headers.Any(header => string.Equals(header, requiredColumn, StringComparison.OrdinalIgnoreCase)))
            .ToArray();

        if (missingHeaders.Length > 0)
        {
            throw new JobListingCsvFormatException(
                $"Missing required columns: {string.Join(", ", missingHeaders)}");
        }

        var rows = new List<ParsedImportRow>();
        while (await csv.ReadAsync())
        {
            cancellationToken.ThrowIfCancellationRequested();
            var rowNumber = checked((int)csv.Context.Parser!.Row);
            var isMalformed = malformedRows.Contains(rowNumber);

            var values = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
            foreach (var header in headers)
            {
                values[header] = csv.GetField(header);
            }

            rows.Add(new ParsedImportRow(rowNumber, isMalformed, values));
        }

        return rows;
    }

    private async Task<List<JobListing>> FindExistingListingsAsync(
        List<ValidatedImportRow> candidates,
        CancellationToken cancellationToken)
    {
        if (candidates.Count == 0)
        {
            return [];
        }

        var existingListings = new List<JobListing>();
        var sourceIds = candidates.Select(c => c.SourceId).Distinct().ToArray();
        var candidateIds = candidates.Select(c => c.SourceJobId).Distinct().ToArray();

        for (var i = 0; i < candidateIds.Length; i += DuplicateQueryChunkSize)
        {
            var chunk = candidateIds.Skip(i).Take(DuplicateQueryChunkSize).ToArray();
            var chunkListings = await _dbContext.JobListings
                .Where(listing => sourceIds.Contains(listing.JobListingSourceId) &&
                                  listing.SourceIdentifier != null &&
                                  chunk.Contains(listing.SourceIdentifier))
                .ToListAsync(cancellationToken);

            existingListings.AddRange(chunkListings);
        }

        return existingListings;
    }

    private static JobListingImportSummary EmptySummary() =>
        new(0, 0, 0, 0, 0, Array.Empty<JobListingImportError>());

    private sealed record ParsedImportRow(int RowNumber, bool IsMalformed, IReadOnlyDictionary<string, string?> Values)
    {
        public string? Get(string column) => Values.TryGetValue(column, out var value) ? value : null;
    }

    private sealed record ValidatedImportRow(
        int RowNumber,
        string Title,
        string CompanyName,
        Guid TechnologyId,
        Guid LocationId,
        Guid ExperienceRangeId,
        Guid SourceId,
        string SourceJobId,
        DateTime? PostedDateUtc,
        string DataQualityStatus,
        string? JobUrl,
        string? WorkMode,
        string? EmploymentType,
        decimal? SalaryMin,
        decimal? SalaryMax,
        string? Description);

    private readonly record struct DuplicateKey(Guid SourceId, string SourceJobId);
}
