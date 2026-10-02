using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using JobPulse.Application.JobSeekers;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Dashboard;

public sealed class DashboardOverviewService : IDashboardOverviewService
{
    private readonly JobPulseDbContext _dbContext;
    private readonly IActiveJobSeekerCountService _activeJobSeekerCountService;
    private readonly IJobListingStatisticsService _jobListingStatisticsService;
    private readonly IActiveJobListingsByTechnologyService _technologyCountsService;
    private readonly IActiveJobListingsByCityService _cityCountsService;

    public DashboardOverviewService(
        JobPulseDbContext dbContext,
        IActiveJobSeekerCountService activeJobSeekerCountService,
        IJobListingStatisticsService jobListingStatisticsService,
        IActiveJobListingsByTechnologyService technologyCountsService,
        IActiveJobListingsByCityService cityCountsService)
    {
        _dbContext = dbContext;
        _activeJobSeekerCountService = activeJobSeekerCountService;
        _jobListingStatisticsService = jobListingStatisticsService;
        _technologyCountsService = technologyCountsService;
        _cityCountsService = cityCountsService;
    }

    public async Task<DashboardOverviewResponse> GetOverviewAsync(CancellationToken cancellationToken = default)
    {
        var activeRegisteredJobSeekers = await _activeJobSeekerCountService
            .GetActiveJobSeekerCountAsync(cancellationToken);
        var listingStatistics = await _jobListingStatisticsService
            .GetStatisticsAsync(cancellationToken);
        var technologyCounts = await _technologyCountsService
            .GetActiveJobCountsByTechnologyAsync(cancellationToken);
        var cityCounts = await _cityCountsService
            .GetActiveJobCountsByCityAsync(cancellationToken);
        var latestJobSeekerUpdate = await _dbContext.JobSeekers
            .AsNoTracking()
            .MaxAsync(js => (DateTime?)js.CollectedAtUtc, cancellationToken);

        var latestJobUpdate = await _dbContext.JobListings
            .AsNoTracking()
            .MaxAsync(j => (DateTime?)j.CollectedAtUtc, cancellationToken);

        return new DashboardOverviewResponse(
            activeRegisteredJobSeekers,
            listingStatistics.TotalActiveJobListings,
            listingStatistics.NewListingsLast7Days,
            listingStatistics.NewListingsLast30Days,
            technologyCounts
                .OrderByDescending(result => result.JobCount)
                .ThenBy(result => result.TechnologyName, StringComparer.OrdinalIgnoreCase)
                .ToList(),
            cityCounts
                .OrderByDescending(result => result.JobCount)
                .ThenBy(result => result.City, StringComparer.OrdinalIgnoreCase)
                .ThenBy(result => result.State, StringComparer.OrdinalIgnoreCase)
                .ToList(),
            newestDate(latestJobSeekerUpdate, latestJobUpdate));
    }

    private static DateTime? newestDate(DateTime? left, DateTime? right)
    {
        if (left is null)
        {
            return right;
        }

        if (right is null)
        {
            return left;
        }

        return left.Value > right.Value ? left.Value : right.Value;
    }
}
