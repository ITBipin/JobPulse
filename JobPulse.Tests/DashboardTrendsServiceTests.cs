using JobPulse.Application.Dashboard;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Dashboard;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class DashboardTrendsServiceTests
{
    [Fact]
    public async Task GetTrendsAsync_QueriesStoredSnapshotsWithinInclusiveDateRange()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        context.MarketSnapshots.AddRange(
            CreateSnapshot(new DateOnly(2026, 9, 27), 27),
            CreateSnapshot(new DateOnly(2026, 9, 28), 28),
            CreateSnapshot(new DateOnly(2026, 9, 30), 30),
            CreateSnapshot(new DateOnly(2026, 10, 1), 31));
        await context.SaveChangesAsync();
        var service = CreateService(context);

        var result = await service.GetTrendsAsync(new DashboardTrendsQuery
        {
            From = new DateOnly(2026, 9, 28),
            To = new DateOnly(2026, 9, 30)
        });

        Assert.Equal(new DateOnly(2026, 9, 28), result.From);
        Assert.Equal(new DateOnly(2026, 9, 30), result.To);
        Assert.Equal("platform_snapshots", result.DataSource);
        Assert.Equal("historical_snapshot", result.DataType);
        Assert.Equal(new DateTimeOffset(new DateTime(2026, 9, 30, 12, 0, 0, DateTimeKind.Utc)), result.LastUpdated);
        Assert.Collection(
            result.Data,
            item => Assert.Equal(new DateOnly(2026, 9, 28), item.SnapshotDate),
            item => Assert.Equal(new DateOnly(2026, 9, 30), item.SnapshotDate));
    }

    [Fact]
    public async Task GetTrendsAsync_UsesLatestThirtyAvailableSnapshotsWhenDatesAreOmitted()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        var firstSnapshotDate = new DateOnly(2026, 8, 1);
        context.MarketSnapshots.AddRange(Enumerable.Range(0, 32)
            .Select(dayOffset => CreateSnapshot(firstSnapshotDate.AddDays(dayOffset), dayOffset + 1)));
        await context.SaveChangesAsync();
        var service = CreateService(context);

        var result = await service.GetTrendsAsync(new DashboardTrendsQuery());

        Assert.Equal(firstSnapshotDate.AddDays(2), result.From);
        Assert.Equal(firstSnapshotDate.AddDays(31), result.To);
        Assert.Equal(30, result.Data.Count);
        Assert.Equal(firstSnapshotDate.AddDays(2), result.Data[0].SnapshotDate);
        Assert.Equal(firstSnapshotDate.AddDays(31), result.Data[^1].SnapshotDate);
    }

    [Fact]
    public async Task GetTrendsAsync_UsesCurrentUtcWindowWhenNoSnapshotsOrDatesExist()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);

        var result = await CreateService(context).GetTrendsAsync(new DashboardTrendsQuery());

        Assert.Equal(new DateOnly(2026, 9, 3), result.From);
        Assert.Equal(new DateOnly(2026, 10, 2), result.To);
        Assert.Null(result.LastUpdated);
        Assert.Empty(result.Data);
    }

    private static MarketSnapshot CreateSnapshot(DateOnly date, int activeTrackedJobs) => new()
    {
        SnapshotDate = date,
        ActiveTrackedJobs = activeTrackedJobs,
        ActiveRegisteredJobSeekers = activeTrackedJobs + 1,
        NewJobsLast7Days = activeTrackedJobs + 2,
        NewJobsLast30Days = activeTrackedJobs + 3,
        CreatedAt = date.ToDateTime(new TimeOnly(12, 0), DateTimeKind.Utc)
    };

    private static DashboardTrendsService CreateService(JobPulseDbContext context) =>
        new(context, new FixedTimeProvider(new DateTimeOffset(2026, 10, 2, 12, 0, 0, TimeSpan.Zero)));

    private sealed class FixedTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _now;

        public FixedTimeProvider(DateTimeOffset now)
        {
            _now = now;
        }

        public override DateTimeOffset GetUtcNow() => _now;
    }
}