using JobPulse.Application.Jobs;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Jobs;

public sealed class JobListingStatisticsService : IJobListingStatisticsService
{
    private readonly JobPulseDbContext _dbContext;
    private readonly TimeProvider _timeProvider;

    public JobListingStatisticsService(JobPulseDbContext dbContext, TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _timeProvider = timeProvider;
    }

    public async Task<JobListingStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var nowUtc = _timeProvider.GetUtcNow().UtcDateTime;
        var sevenDayCutoffUtc = nowUtc.AddDays(-7);
        var thirtyDayCutoffUtc = nowUtc.AddDays(-30);

        var totalActiveJobListings = await _dbContext.JobListings
            .AsNoTracking()
            .CountAsync(listing => listing.IsActive, cancellationToken);

        var newListingsLast7Days = await _dbContext.JobListings
            .AsNoTracking()
            .CountAsync(listing => listing.CollectedAtUtc >= sevenDayCutoffUtc, cancellationToken);

        var newListingsLast30Days = await _dbContext.JobListings
            .AsNoTracking()
            .CountAsync(listing => listing.CollectedAtUtc >= thirtyDayCutoffUtc, cancellationToken);

        return new JobListingStatistics(
            totalActiveJobListings,
            newListingsLast7Days,
            newListingsLast30Days);
    }
}