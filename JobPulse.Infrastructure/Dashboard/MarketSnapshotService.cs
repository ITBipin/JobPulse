using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Dashboard;

public sealed class MarketSnapshotService : IMarketSnapshotService
{
    private readonly JobPulseDbContext _dbContext;
    private readonly IActiveJobSeekerCountService _activeJobSeekerCountService;
    private readonly IJobListingStatisticsService _jobListingStatisticsService;
    private readonly TimeProvider _timeProvider;

    public MarketSnapshotService(
        JobPulseDbContext dbContext,
        IActiveJobSeekerCountService activeJobSeekerCountService,
        IJobListingStatisticsService jobListingStatisticsService,
        TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _activeJobSeekerCountService = activeJobSeekerCountService;
        _jobListingStatisticsService = jobListingStatisticsService;
        _timeProvider = timeProvider;
    }

    public async Task<MarketSnapshotCreationResult> CreateTodaysSnapshotAsync(
        CancellationToken cancellationToken = default)
    {
        var createdAtUtc = _timeProvider.GetUtcNow().UtcDateTime;
        var snapshotDate = DateOnly.FromDateTime(createdAtUtc);
        var existingSnapshot = await _dbContext.MarketSnapshots
            .AsNoTracking()
            .FirstOrDefaultAsync(snapshot => snapshot.SnapshotDate == snapshotDate, cancellationToken);

        if (existingSnapshot is not null)
        {
            return ToResult(existingSnapshot, wasCreated: false);
        }

        var activeRegisteredJobSeekers = await _activeJobSeekerCountService
            .GetActiveJobSeekerCountAsync(cancellationToken);
        var listingStatistics = await _jobListingStatisticsService
            .GetStatisticsAsync(cancellationToken);

        var snapshot = new MarketSnapshot
        {
            SnapshotDate = snapshotDate,
            ActiveTrackedJobs = listingStatistics.TotalActiveJobListings,
            ActiveRegisteredJobSeekers = activeRegisteredJobSeekers,
            NewJobsLast7Days = listingStatistics.NewListingsLast7Days,
            NewJobsLast30Days = listingStatistics.NewListingsLast30Days,
            CreatedAt = createdAtUtc
        };

        _dbContext.MarketSnapshots.Add(snapshot);
        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            _dbContext.Entry(snapshot).State = EntityState.Detached;
            existingSnapshot = await _dbContext.MarketSnapshots
                .AsNoTracking()
                .FirstOrDefaultAsync(item => item.SnapshotDate == snapshotDate, cancellationToken);

            if (existingSnapshot is null)
            {
                throw;
            }

            return ToResult(existingSnapshot, wasCreated: false);
        }

        return ToResult(snapshot, wasCreated: true);
    }

    private static MarketSnapshotCreationResult ToResult(MarketSnapshot snapshot, bool wasCreated) =>
        new(
            new MarketSnapshotDto(
                snapshot.Id,
                snapshot.SnapshotDate,
                snapshot.ActiveTrackedJobs,
                snapshot.ActiveRegisteredJobSeekers,
                snapshot.NewJobsLast7Days,
                snapshot.NewJobsLast30Days,
                new DateTimeOffset(DateTime.SpecifyKind(snapshot.CreatedAt, DateTimeKind.Utc))),
            wasCreated);
}