using JobPulse.Application.Dashboard;
using JobPulse.Application.JobSeekers;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Dashboard;

public sealed class JobMarketPressureRatioService : IJobMarketPressureRatioService
{
    private readonly JobPulseDbContext _dbContext;
    private readonly IActiveJobSeekerCountService _activeJobSeekerCountService;

    public JobMarketPressureRatioService(
        JobPulseDbContext dbContext,
        IActiveJobSeekerCountService activeJobSeekerCountService)
    {
        _dbContext = dbContext;
        _activeJobSeekerCountService = activeJobSeekerCountService;
    }

    public async Task<JobMarketPressureRatioResponse> CalculateAsync(
        JobMarketPressureRatioQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        if (query.TechnologyId == Guid.Empty || query.LocationId == Guid.Empty || query.ExperienceRangeId == Guid.Empty)
        {
            throw new ArgumentException("Optional filters must be non-empty identifiers when provided.", nameof(query));
        }

        var seekerFilter = new ActiveJobSeekerCountFilter(
            query.TechnologyId,
            query.LocationId,
            query.ExperienceRangeId);
        var activeRegisteredJobSeekers = await _activeJobSeekerCountService
            .GetActiveJobSeekerCountAsync(seekerFilter, cancellationToken);

        var listingQuery = _dbContext.JobListings
            .AsNoTracking()
            .Where(listing => listing.IsActive);

        if (query.TechnologyId.HasValue)
        {
            listingQuery = listingQuery.Where(listing => listing.TechnologyId == query.TechnologyId.Value);
        }

        if (query.LocationId.HasValue)
        {
            listingQuery = listingQuery.Where(listing => listing.LocationId == query.LocationId.Value);
        }

        if (query.ExperienceRangeId.HasValue)
        {
            listingQuery = listingQuery.Where(listing => listing.ExperienceRangeId == query.ExperienceRangeId.Value);
        }

        var activeTrackedJobListings = await listingQuery.CountAsync(cancellationToken);
        var isAvailable = activeTrackedJobListings > 0;
        decimal? ratio = isAvailable
            ? activeRegisteredJobSeekers / (decimal)activeTrackedJobListings
            : null;

        return new JobMarketPressureRatioResponse(
            ratio,
            isAvailable,
            new JobMarketPressureSampleSize(activeRegisteredJobSeekers, activeTrackedJobListings),
            new JobMarketPressureFilters(query.TechnologyId, query.LocationId, query.ExperienceRangeId),
            new JobMarketPressureMetadata(
                "platform_specific",
                "JobPulse active registered job seekers and active tracked job listings",
                "Platform-specific ratio: active registered job seekers divided by active tracked job listings, using the selected filters.",
                isAvailable ? null : "No active tracked job listings matched the selected filters."));
    }
}