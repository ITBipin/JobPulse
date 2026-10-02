using JobPulse.Application.Jobs;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Jobs;

public sealed class JobListService : IJobListService
{
    private readonly JobPulseDbContext _dbContext;

    public JobListService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<JobListResponse> GetJobsAsync(JobListQuery query, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        var pageNumber = query.PageNumber < 1 ? 1 : query.PageNumber;
        var pageSize = query.PageSize < 1 ? 20 : Math.Min(query.PageSize, 100);

        var jobQuery = _dbContext.JobListings
            .AsNoTracking()
            .Include(j => j.Technology)
            .Include(j => j.Location)
            .Include(j => j.ExperienceRange)
            .Include(j => j.JobListingSource)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.Trim();
            jobQuery = jobQuery.Where(j => j.Title.Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(query.Technology))
        {
            var technologyName = query.Technology.Trim();
            jobQuery = jobQuery.Where(j => j.Technology.Name == technologyName);
        }

        if (!string.IsNullOrWhiteSpace(query.Location))
        {
            var locationName = query.Location.Trim();
            jobQuery = jobQuery.Where(j => j.Location.City == locationName);
        }

        if (!string.IsNullOrWhiteSpace(query.Experience))
        {
            var experienceName = query.Experience.Trim();
            jobQuery = jobQuery.Where(j => j.ExperienceRange.Label == experienceName);
        }

        if (query.FromDate.HasValue || query.ToDate.HasValue)
        {
            var fromDate = query.FromDate?.Date;
            var toDate = query.ToDate?.Date.AddDays(1).AddTicks(-1);

            jobQuery = jobQuery.Where(j =>
                (!fromDate.HasValue || (j.OriginalPostedDateUtc ?? j.CollectedAtUtc) >= fromDate.Value) &&
                (!toDate.HasValue || (j.OriginalPostedDateUtc ?? j.CollectedAtUtc) <= toDate.Value));
        }

        var totalCount = await jobQuery.CountAsync(cancellationToken);
        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

        var items = await jobQuery
            .OrderByDescending(j => j.OriginalPostedDateUtc ?? j.CollectedAtUtc)
            .ThenByDescending(j => j.CollectedAtUtc)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(j => new JobListItemDto(
                j.Id,
                j.Title,
                j.CompanyName,
                j.Technology.Name,
                j.Location.City,
                j.ExperienceRange.Label,
                j.JobListingSource.Name,
                j.CollectedAtUtc,
                j.OriginalPostedDateUtc,
                j.EmploymentType,
                j.WorkMode,
                j.JobUrl,
                j.DataQualityStatus))
            .ToListAsync(cancellationToken);

        return new JobListResponse(items, pageNumber, pageSize, totalCount, totalPages);
    }

    public Task<JobListingDto?> GetJobByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _dbContext.JobListings
            .AsNoTracking()
            .Where(j => j.Id == id)
            .Select(j => new JobListingDto(
                j.Id,
                j.Title,
                j.CompanyName,
                j.JobUrl,
                j.SourceIdentifier,
                j.CollectedAtUtc,
                j.OriginalPostedDateUtc,
                j.DataQualityStatus,
                j.WorkMode,
                j.EmploymentType,
                j.SalaryMin,
                j.SalaryMax,
                j.Description,
                new JobTechnologyDto(j.Technology.Id, j.Technology.Name),
                new JobLocationDto(j.Location.Id, j.Location.City, j.Location.State, j.Location.Country, j.Location.Region),
                j.ExperienceRange.Label,
                new JobSourceDto(j.JobListingSource.Id, j.JobListingSource.Name, j.JobListingSource.WebsiteUrl)))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
