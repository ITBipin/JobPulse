using System.Text;
using JobPulse.Application.Jobs;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Jobs;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class JobListingImportServiceTests
{
    private const string Header = "Title,CompanyName,Technology,Location,ExperienceRange,Source,SourceJobId,PostedDate";
    private const string ValidRow = "Software Engineer,Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-1,2026-09-15";

    [Fact]
    public async Task ImportCsvAsync_ImportsValidRowUsingExistingLookupEntities()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var result = await ImportAsync(data.Context, $"{Header}\n{ValidRow}");

            Assert.Equal(1, result.TotalRows);
            Assert.Equal(1, result.ImportedRows);
            Assert.Equal(0, result.SkippedRows);
            Assert.Equal(0, result.DuplicateRows);
            Assert.Equal(0, result.InvalidRows);
            Assert.Empty(result.Errors);

            var listing = await data.Context.JobListings.SingleAsync();
            Assert.Equal("Software Engineer", listing.Title);
            Assert.Equal("Example Corp", listing.CompanyName);
            Assert.Equal(data.Technology.Id, listing.TechnologyId);
            Assert.Equal(data.Location.Id, listing.LocationId);
            Assert.Equal(data.ExperienceRange.Id, listing.ExperienceRangeId);
            Assert.Equal(data.Source.Id, listing.JobListingSourceId);
            Assert.Equal("job-1", listing.SourceIdentifier);
            Assert.Equal("Valid", listing.DataQualityStatus);
            Assert.True(listing.LastSeenAt >= new DateTimeOffset(DateTime.UtcNow.AddMinutes(-1)));
            Assert.Equal(DateTimeKind.Utc, listing.CollectedAtUtc.Kind);
            Assert.True(Math.Abs((listing.CollectedAtUtc - listing.LastSeenAt.UtcDateTime).TotalSeconds) < 1);
            Assert.Equal(new DateTime(2026, 9, 15, 0, 0, 0, DateTimeKind.Utc), listing.OriginalPostedDateUtc);
            Assert.Equal(1, await data.Context.Technologies.CountAsync());
            Assert.Equal(1, await data.Context.Locations.CountAsync());
            Assert.Equal(1, await data.Context.ExperienceRanges.CountAsync());
            Assert.Equal(1, await data.Context.JobListingSources.CountAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SetsCollectedAtAndLastSeenAtOnImport()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var before = DateTimeOffset.UtcNow.AddSeconds(-1);
            var result = await ImportAsync(data.Context, $"{Header}\n{ValidRow}");
            var after = DateTimeOffset.UtcNow.AddSeconds(1);

            Assert.Equal(1, result.ImportedRows);
            var listing = await data.Context.JobListings.SingleAsync();

            Assert.True(listing.CollectedAtUtc >= before.UtcDateTime && listing.CollectedAtUtc <= after.UtcDateTime);
            Assert.Equal(listing.CollectedAtUtc, listing.CollectedAt);
            Assert.True(listing.LastSeenAt >= before && listing.LastSeenAt <= after);

            var source = await data.Context.JobListingSources.SingleAsync();
            Assert.NotNull(source.LastSuccessfulCollectionAt);
            Assert.Equal(source.LastSuccessfulCollectionAt, source.LastSuccessfulImportTime);
            Assert.True(source.LastSuccessfulCollectionAt >= before && source.LastSuccessfulCollectionAt <= after);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_ReimportUpdatesLastSeenWithoutAddingAnotherListing()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var existing = CreateExistingListing(data, "job-1");
            existing.LastSeenAt = DateTimeOffset.UtcNow.AddDays(-2);
            var originalCollected = existing.CollectedAtUtc;
            data.Context.JobListings.Add(existing);
            await data.Context.SaveChangesAsync();
            var oldLastSeen = existing.LastSeenAt;

            await ImportAsync(data.Context, $"{Header}\n{ValidRow}");

            Assert.Single(await data.Context.JobListings.ToListAsync());
            Assert.True(existing.LastSeenAt > oldLastSeen);
            Assert.Equal(originalCollected, existing.CollectedAtUtc);
            Assert.Equal(originalCollected, existing.CollectedAt);

            var source = await data.Context.JobListingSources.SingleAsync();
            Assert.True(source.LastSuccessfulCollectionAt > oldLastSeen);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_AllowedIncompleteRow_SetsDataQualityStatusToIncomplete()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var incompleteRow = "Software Engineer,Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-inc,";
            var result = await ImportAsync(data.Context, $"{Header}\n{incompleteRow}");

            Assert.Equal(1, result.TotalRows);
            Assert.Equal(1, result.ImportedRows);
            Assert.Equal(0, result.InvalidRows);

            var listing = await data.Context.JobListings.SingleAsync();
            Assert.Equal(JobDataQualityStatus.Incomplete, listing.DataQualityStatus);
            Assert.Null(listing.OriginalPostedDateUtc);
            Assert.True(listing.IsActive);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_ExplicitIncompleteAndInvalidStatusHandled()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var customHeader = $"{Header},DataQualityStatus";
            var row1 = $"{ValidRow},Incomplete";
            var row2 = "Senior Dev,Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-inv,2026-09-15,Invalid";

            var result = await ImportAsync(data.Context, $"{customHeader}\n{row1}\n{row2}");

            Assert.Equal(2, result.TotalRows);
            Assert.Equal(1, result.ImportedRows);
            Assert.Equal(1, result.InvalidRows);
            Assert.Equal("Record is marked as invalid", result.Errors.Single().Reason);

            var listing = await data.Context.JobListings.SingleAsync();
            Assert.Equal("job-1", listing.SourceIdentifier);
            Assert.Equal(JobDataQualityStatus.Incomplete, listing.DataQualityStatus);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_InvalidRecordsAreNeverInsertedAsActiveListings()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var invalidRow1 = ",Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-bad1,2026-09-15";
            var invalidRow2 = "Engineer,,C#,Bengaluru,2-5 years,TrustedFeed,job-bad2,2026-09-15";
            var invalidRow3 = "Engineer,Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-bad3,bad-date";

            var result = await ImportAsync(data.Context, $"{Header}\n{invalidRow1}\n{invalidRow2}\n{invalidRow3}");

            Assert.Equal(3, result.TotalRows);
            Assert.Equal(0, result.ImportedRows);
            Assert.Equal(3, result.InvalidRows);
            Assert.Empty(await data.Context.JobListings.ToListAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_EmptyCsvReturnsZeroCounts()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var result = await ImportAsync(data.Context, string.Empty);

            Assert.Equal(0, result.TotalRows);
            Assert.Equal(0, result.ImportedRows);
            Assert.Equal(0, result.SkippedRows);
            Assert.Equal(0, result.DuplicateRows);
            Assert.Equal(0, result.InvalidRows);
            Assert.Empty(result.Errors);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_RejectsMissingRequiredColumns()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var exception = await Assert.ThrowsAsync<JobListingCsvFormatException>(
                () => ImportAsync(data.Context, "Title,CompanyName\nEngineer,Example"));

            Assert.Contains("Technology", exception.Message);
            Assert.Contains("SourceJobId", exception.Message);
            Assert.Empty(await data.Context.JobListings.ToListAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SkipsInvalidRowAndReportsCsvRowNumber()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var result = await ImportAsync(data.Context, $"{Header}\n,Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-1,2026-09-15");

            Assert.Equal(1, result.TotalRows);
            Assert.Equal(0, result.ImportedRows);
            Assert.Equal(1, result.SkippedRows);
            Assert.Equal(0, result.DuplicateRows);
            Assert.Equal(1, result.InvalidRows);
            Assert.Equal(2, result.Errors.Single().RowNumber);
            Assert.Equal("Title is required", result.Errors.Single().Reason);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SkipsExistingAndRepeatedSourceJobIdsAsDuplicates()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            data.Context.JobListings.Add(CreateExistingListing(data, "job-1"));
            await data.Context.SaveChangesAsync();

            var result = await ImportAsync(data.Context, $"{Header}\n{ValidRow}\n{ValidRow}\n{ValidRow}");

            Assert.Equal(3, result.TotalRows);
            Assert.Equal(0, result.ImportedRows);
            Assert.Equal(3, result.SkippedRows);
            Assert.Equal(3, result.DuplicateRows);
            Assert.Equal(0, result.InvalidRows);
            Assert.Empty(result.Errors);
            Assert.Single(await data.Context.JobListings.ToListAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_ReturnsCountsForMixedValidDuplicateAndInvalidRows()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            data.Context.JobListings.Add(CreateExistingListing(data, "job-duplicate"));
            await data.Context.SaveChangesAsync();
            var duplicate = ValidRow.Replace("job-1", "job-duplicate", StringComparison.Ordinal);
            var invalidDate = ValidRow.Replace("job-1", "job-invalid", StringComparison.Ordinal)
                .Replace("2026-09-15", "not-a-date", StringComparison.Ordinal);

            var result = await ImportAsync(data.Context, $"{Header}\n{ValidRow}\n{duplicate}\n{invalidDate}");

            Assert.Equal(3, result.TotalRows);
            Assert.Equal(1, result.ImportedRows);
            Assert.Equal(2, result.SkippedRows);
            Assert.Equal(1, result.DuplicateRows);
            Assert.Equal(1, result.InvalidRows);
            Assert.Equal("PostedDate is invalid", result.Errors.Single().Reason);
            Assert.Equal(2, await data.Context.JobListings.CountAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SkipsUnknownTechnology()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var row = ValidRow.Replace(",C#,Bengaluru,", ",UnknownTech,Bengaluru,", StringComparison.Ordinal);

            var result = await ImportAsync(data.Context, $"{Header}\n{row}");

            Assert.Equal("Technology 'UnknownTech' was not found", result.Errors.Single().Reason);
            Assert.Equal(1, result.InvalidRows);
            Assert.Empty(await data.Context.JobListings.ToListAsync());
            Assert.Equal(1, await data.Context.Technologies.CountAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SkipsUnknownLocation()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var row = ValidRow.Replace(",Bengaluru,", ",UnknownCity,", StringComparison.Ordinal);

            var result = await ImportAsync(data.Context, $"{Header}\n{row}");

            Assert.Equal("Location 'UnknownCity' was not found", result.Errors.Single().Reason);
            Assert.Equal(1, result.InvalidRows);
            Assert.Empty(await data.Context.JobListings.ToListAsync());
            Assert.Equal(1, await data.Context.Locations.CountAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_ReportsInvalidPostedDate()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var row = ValidRow.Replace("2026-09-15", "15/99/2026", StringComparison.Ordinal);

            var result = await ImportAsync(data.Context, $"{Header}\n{row}");

            Assert.Equal("PostedDate is invalid", result.Errors.Single().Reason);
            Assert.Equal(1, result.InvalidRows);
            Assert.Empty(await data.Context.JobListings.ToListAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_ReportsEmptyRequiredField()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var row = ValidRow.Replace("Example Corp", "", StringComparison.Ordinal);

            var result = await ImportAsync(data.Context, $"{Header}\n{row}");

            Assert.Equal("CompanyName is required", result.Errors.Single().Reason);
            Assert.Equal(1, result.InvalidRows);
            Assert.Empty(await data.Context.JobListings.ToListAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SuccessfulImport_CreatesCompletedBatchWithCorrectCountsAndTimestamps()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var before = DateTimeOffset.UtcNow;
            var result = await ImportAsync(data.Context, $"{Header}\n{ValidRow}");
            var after = DateTimeOffset.UtcNow;

            var batch = await data.Context.JobImportBatches.SingleAsync();
            Assert.Equal(JobImportBatchStatuses.Completed, batch.Status);
            Assert.Equal(1, batch.TotalRows);
            Assert.Equal(1, batch.ImportedRows);
            Assert.Equal(0, batch.DuplicateRows);
            Assert.Equal(0, batch.InvalidRows);
            Assert.Equal(0, batch.SkippedRows);
            Assert.True(batch.StartedAt >= before && batch.StartedAt <= after);
            Assert.NotNull(batch.CompletedAt);
            Assert.True(batch.CompletedAt >= batch.StartedAt && batch.CompletedAt <= after);
            Assert.Equal(data.Source.Id, batch.SourceId);
            Assert.Null(batch.ErrorMessage);
            Assert.Equal(batch.Id, result.ImportBatchId);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_WithDuplicateAndInvalidRows_StoresAccurateCountsInBatch()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            await ImportAsync(data.Context, $"{Header}\n{ValidRow}");

            var csv = $"{Header}\n" +
                      $"{ValidRow}\n" +
                      "New Dev,New Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-2,2026-09-15\n" +
                      "Unknown Tech Dev,Unknown Corp,Rust,Bengaluru,2-5 years,TrustedFeed,job-3,2026-09-15";

            var result = await ImportAsync(data.Context, csv);

            var batches = await data.Context.JobImportBatches.OrderBy(b => b.StartedAt).ToListAsync();
            Assert.Equal(2, batches.Count);

            var secondBatch = batches[1];
            Assert.Equal(JobImportBatchStatuses.Completed, secondBatch.Status);
            Assert.Equal(3, secondBatch.TotalRows);
            Assert.Equal(1, secondBatch.ImportedRows);
            Assert.Equal(1, secondBatch.DuplicateRows);
            Assert.Equal(1, secondBatch.InvalidRows);
            Assert.Equal(2, secondBatch.SkippedRows);
            Assert.Equal(secondBatch.Id, result.ImportBatchId);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_UnexpectedFailure_CreatesFailedBatchWithErrorMessage()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var invalidCsv = "WrongHeader1,WrongHeader2\nValue1,Value2";
            var ex = await Assert.ThrowsAsync<JobListingCsvFormatException>(() => ImportAsync(data.Context, invalidCsv));

            var batch = await data.Context.JobImportBatches.SingleAsync();
            Assert.Equal(JobImportBatchStatuses.Failed, batch.Status);
            Assert.NotNull(batch.CompletedAt);
            Assert.True(batch.CompletedAt >= batch.StartedAt);
            Assert.NotNull(batch.ErrorMessage);
            Assert.Contains("Missing required columns", batch.ErrorMessage);
            Assert.Equal(ex.Message, batch.ErrorMessage);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SourceRelationship_NavigatesToJobListingSource()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            await ImportAsync(data.Context, $"{Header}\n{ValidRow}");

            var batch = await data.Context.JobImportBatches
                .Include(b => b.Source)
                .SingleAsync();

            Assert.NotNull(batch.Source);
            Assert.Equal(data.Source.Id, batch.Source.Id);
            Assert.Equal("TrustedFeed", batch.Source.Name);

            var source = await data.Context.JobListingSources
                .Include(s => s.ImportBatches)
                .SingleAsync(s => s.Id == data.Source.Id);

            Assert.Contains(source.ImportBatches, b => b.Id == batch.Id);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_SkipsInactiveSource_AndReturnsRowError()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var inactiveSource = new JobListingSource { Name = "InactiveFeed", IsActive = false };
            data.Context.JobListingSources.Add(inactiveSource);
            await data.Context.SaveChangesAsync();

            var row = ValidRow.Replace("TrustedFeed", "InactiveFeed", StringComparison.Ordinal);
            var result = await ImportAsync(data.Context, $"{Header}\n{row}");

            Assert.Equal(1, result.TotalRows);
            Assert.Equal(0, result.ImportedRows);
            Assert.Equal(1, result.InvalidRows);
            Assert.Equal("Source 'InactiveFeed' is inactive", result.Errors.Single().Reason);
            Assert.Empty(await data.Context.JobListings.ToListAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_ReusesExistingSourceCaseInsensitively()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var lowerCaseSourceRow = ValidRow.Replace("TrustedFeed", "trustedfeed", StringComparison.Ordinal);
            var result = await ImportAsync(data.Context, $"{Header}\n{lowerCaseSourceRow}");

            Assert.Equal(1, result.ImportedRows);
            var listing = await data.Context.JobListings.SingleAsync();
            Assert.Equal(data.Source.Id, listing.JobListingSourceId);
            Assert.Equal(1, await data.Context.JobListingSources.CountAsync());
        }
    }

    [Fact]
    public async Task ImportCsvAsync_ValidRowWithOptionalFieldsMissing_SuccessfullyImported()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var result = await ImportAsync(data.Context, $"{Header}\n{ValidRow}");

            Assert.Equal(1, result.ImportedRows);
            var listing = await data.Context.JobListings.SingleAsync();
            Assert.Equal(JobDataQualityStatus.Valid, listing.DataQualityStatus);
            Assert.Null(listing.JobUrl);
            Assert.Null(listing.WorkMode);
            Assert.Null(listing.SalaryMin);
            Assert.Null(listing.Description);
        }
    }

    [Fact]
    public async Task ImportCsvAsync_DuplicateWithinSameCsvAndDistinctRows_CalculatesCorrectCounts()
    {
        var data = await CreateContextWithLookupsAsync();
        await using (data.Context)
        {
            var row2 = "Product Manager,Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,job-2,2026-09-15";
            var csv = $"{Header}\n{ValidRow}\n{ValidRow}\n{row2}";

            var result = await ImportAsync(data.Context, csv);

            Assert.Equal(3, result.TotalRows);
            Assert.Equal(2, result.ImportedRows);
            Assert.Equal(1, result.DuplicateRows);
            Assert.Equal(0, result.InvalidRows);
            Assert.Equal(2, await data.Context.JobListings.CountAsync());
        }
    }

    private static Task<JobListingImportSummary> ImportAsync(JobPulseDbContext context, string csv) =>
        new JobListingImportService(context).ImportCsvAsync(new MemoryStream(Encoding.UTF8.GetBytes(csv)));

    private static async Task<ImportLookupData> CreateContextWithLookupsAsync()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new JobPulseDbContext(options);
        var technology = new Technology { Name = "C#" };
        var location = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var experienceRange = new ExperienceRange { MinimumYears = 2, MaximumYears = 5, Label = "2-5 years" };
        var source = new JobListingSource { Name = "TrustedFeed" };
        context.AddRange(technology, location, experienceRange, source);
        await context.SaveChangesAsync();
        return new ImportLookupData(context, technology, location, experienceRange, source);
    }

    private static JobListing CreateExistingListing(ImportLookupData data, string sourceJobId) => new()
    {
        Title = "Existing Engineer",
        CompanyName = "Existing Corp",
        SourceIdentifier = sourceJobId,
        TechnologyId = data.Technology.Id,
        LocationId = data.Location.Id,
        ExperienceRangeId = data.ExperienceRange.Id,
        JobListingSourceId = data.Source.Id
    };

    private sealed record ImportLookupData(
        JobPulseDbContext Context,
        Technology Technology,
        Location Location,
        ExperienceRange ExperienceRange,
        JobListingSource Source);
}
