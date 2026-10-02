using JobPulse.Application.Dashboard;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Dashboard;

public sealed class DashboardTrendsService : IDashboardTrendsService
{
    private const string SnapshotDataSource = "platform_snapshots";
    private const string SnapshotDataType = "historical_snapshot";
    private readonly JobPulseDbContext _dbContext;
    private readonly TimeProvider _timeProvider;

    public DashboardTrendsService(JobPulseDbContext dbContext, TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _timeProvider = timeProvider;
    }

    public async Task<DashboardTrendsResponse> GetTrendsAsync(
        DashboardTrendsQuery query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        if (query.From.HasValue && query.To.HasValue && query.From.Value > query.To.Value)
        {
            throw new ArgumentException("From must be on or before To.", nameof(query));
        }

        DateOnly from;
        DateOnly to;

        if (query.From.HasValue && query.To.HasValue)
        {
            from = query.From.Value;
            to = query.To.Value;
        }
        else if (!query.From.HasValue && !query.To.HasValue)
        {
            var latestSnapshotDates = await _dbContext.MarketSnapshots
                .AsNoTracking()
                .OrderByDescending(snapshot => snapshot.SnapshotDate)
                .Select(snapshot => snapshot.SnapshotDate)
                .Take(30)
                .ToListAsync(cancellationToken);

            if (latestSnapshotDates.Count == 0)
            {
                to = DateOnly.FromDateTime(_timeProvider.GetUtcNow().UtcDateTime);
                from = FromThirtyDayWindow(to);
            }
            else
            {
                from = latestSnapshotDates[^1];
                to = latestSnapshotDates[0];
            }
        }
        else if (query.From.HasValue)
        {
            from = query.From.Value;
            var latestSnapshotDate = await _dbContext.MarketSnapshots
                .AsNoTracking()
                .MaxAsync(snapshot => (DateOnly?)snapshot.SnapshotDate, cancellationToken);
            to = latestSnapshotDate ?? DateOnly.FromDateTime(_timeProvider.GetUtcNow().UtcDateTime);
            if (from > to)
            {
                to = from;
            }
        }
        else
        {
            to = query.To!.Value;
            from = FromThirtyDayWindow(to);
        }

        var snapshotsQuery = _dbContext.MarketSnapshots.AsNoTracking();
        snapshotsQuery = snapshotsQuery.Where(snapshot =>
            snapshot.SnapshotDate >= from && snapshot.SnapshotDate <= to);

        var snapshots = await snapshotsQuery
            .OrderBy(snapshot => snapshot.SnapshotDate)
            .Select(snapshot => new DashboardTrendPoint
            {
                SnapshotDate = snapshot.SnapshotDate,
                ActiveTrackedJobs = snapshot.ActiveTrackedJobs,
                ActiveRegisteredJobSeekers = snapshot.ActiveRegisteredJobSeekers,
                NewJobsLast7Days = snapshot.NewJobsLast7Days,
                NewJobsLast30Days = snapshot.NewJobsLast30Days
            })
            .ToListAsync(cancellationToken);

        var lastUpdatedUtc = await snapshotsQuery
            .MaxAsync(snapshot => (DateTime?)snapshot.CreatedAt, cancellationToken);

        return new DashboardTrendsResponse
        {
            From = from,
            To = to,
            DataSource = SnapshotDataSource,
            DataType = SnapshotDataType,
            LastUpdated = lastUpdatedUtc.HasValue
                ? new DateTimeOffset(DateTime.SpecifyKind(lastUpdatedUtc.Value, DateTimeKind.Utc))
                : null,
            Data = snapshots
        };
    }

    private static DateOnly FromThirtyDayWindow(DateOnly to) =>
        DateOnly.FromDayNumber(Math.Max(0, to.DayNumber - 29));
}