using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Dashboard;
using JobPulse.Infrastructure.Jobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace JobPulse.Tests;

public sealed class JobListingExpiryServiceTests
{
    private static readonly DateTimeOffset FixedNow = new(2026, 10, 2, 12, 0, 0, TimeSpan.Zero);

    [Fact]
    public async Task ExpireStaleJobListingsAsync_FreshJobRemainsActive()
    {
        var context = CreateContext();
        var listing = CreateListing(context, lastSeen: FixedNow.AddHours(-10), isActive: true);
        context.JobListings.Add(listing);
        await context.SaveChangesAsync();

        var service = CreateService(context);
        var result = await service.ExpireStaleJobListingsAsync();

        Assert.Equal(1, result.ProcessedCount);
        Assert.Equal(0, result.ExpiredCount);

        var refreshed = await context.JobListings.SingleAsync();
        Assert.True(refreshed.IsActive);
    }

    [Fact]
    public async Task ExpireStaleJobListingsAsync_StaleJobRemainsActive()
    {
        var context = CreateContext();
        var listing = CreateListing(context, lastSeen: FixedNow.AddHours(-48), isActive: true);
        context.JobListings.Add(listing);
        await context.SaveChangesAsync();

        var service = CreateService(context);
        var result = await service.ExpireStaleJobListingsAsync();

        Assert.Equal(1, result.ProcessedCount);
        Assert.Equal(0, result.ExpiredCount);

        var refreshed = await context.JobListings.SingleAsync();
        Assert.True(refreshed.IsActive);
    }

    [Fact]
    public async Task ExpireStaleJobListingsAsync_ExpiredJobBecomesInactive()
    {
        var context = CreateContext();
        var listing = CreateListing(context, lastSeen: FixedNow.AddHours(-75), isActive: true);
        context.JobListings.Add(listing);
        await context.SaveChangesAsync();

        var service = CreateService(context);
        var result = await service.ExpireStaleJobListingsAsync();

        Assert.Equal(1, result.ProcessedCount);
        Assert.Equal(1, result.ExpiredCount);

        var refreshed = await context.JobListings.SingleAsync();
        Assert.False(refreshed.IsActive);
    }

    [Fact]
    public async Task ExpireStaleJobListingsAsync_AlreadyInactiveJobNotModified()
    {
        var context = CreateContext();
        var listing = CreateListing(context, lastSeen: FixedNow.AddHours(-100), isActive: false);
        context.JobListings.Add(listing);
        await context.SaveChangesAsync();

        var service = CreateService(context);
        var result = await service.ExpireStaleJobListingsAsync();

        Assert.Equal(0, result.ProcessedCount);
        Assert.Equal(0, result.ExpiredCount);

        var refreshed = await context.JobListings.SingleAsync();
        Assert.False(refreshed.IsActive);
    }

    [Fact]
    public async Task ExpireStaleJobListingsAsync_RepeatedExecutionIsSafe()
    {
        var context = CreateContext();
        var listing = CreateListing(context, lastSeen: FixedNow.AddHours(-80), isActive: true);
        context.JobListings.Add(listing);
        await context.SaveChangesAsync();

        var service = CreateService(context);
        var firstResult = await service.ExpireStaleJobListingsAsync();
        Assert.Equal(1, firstResult.ProcessedCount);
        Assert.Equal(1, firstResult.ExpiredCount);

        var secondResult = await service.ExpireStaleJobListingsAsync();
        Assert.Equal(0, secondResult.ProcessedCount);
        Assert.Equal(0, secondResult.ExpiredCount);

        var refreshed = await context.JobListings.SingleAsync();
        Assert.False(refreshed.IsActive);
    }

    [Fact]
    public async Task ExpireStaleJobListingsAsync_CancellationIsRespected()
    {
        var context = CreateContext();
        var listing = CreateListing(context, lastSeen: FixedNow.AddHours(-80), isActive: true);
        context.JobListings.Add(listing);
        await context.SaveChangesAsync();

        var service = CreateService(context);
        using var cts = new CancellationTokenSource();
        cts.Cancel();

        await Assert.ThrowsAnyAsync<OperationCanceledException>(() => service.ExpireStaleJobListingsAsync(cts.Token));
    }

    [Fact]
    public async Task DashboardActiveJobCount_ExcludesExpiredListings()
    {
        var context = CreateContext();
        var activeFresh = CreateListing(context, lastSeen: FixedNow.AddHours(-12), isActive: true);
        var activeExpired = CreateListing(context, lastSeen: FixedNow.AddHours(-90), isActive: true);
        context.JobListings.AddRange(activeFresh, activeExpired);
        await context.SaveChangesAsync();

        var statsService = new JobListingStatisticsService(context, new TestTimeProvider(FixedNow));
        var initialStats = await statsService.GetStatisticsAsync();
        Assert.Equal(2, initialStats.TotalActiveJobListings);

        var expiryService = CreateService(context);
        await expiryService.ExpireStaleJobListingsAsync();

        var updatedStats = await statsService.GetStatisticsAsync();
        Assert.Equal(1, updatedStats.TotalActiveJobListings);
    }

    private static JobPulseDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new JobPulseDbContext(options);
    }

    private static JobListingExpiryService CreateService(JobPulseDbContext context)
    {
        var freshnessOptions = new JobFreshnessOptions(TimeSpan.FromHours(24), TimeSpan.FromHours(72));
        return new JobListingExpiryService(
            context,
            freshnessOptions,
            new TestTimeProvider(FixedNow),
            NullLogger<JobListingExpiryService>.Instance);
    }

    private static JobListing CreateListing(JobPulseDbContext context, DateTimeOffset lastSeen, bool isActive)
    {
        var tech = new Technology { Name = "C#" };
        var loc = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var exp = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = "1-3 years" };
        var source = new JobListingSource { Name = "SourceFeed" };
        context.AddRange(tech, loc, exp, source);
        context.SaveChanges();

        return new JobListing
        {
            Title = "Backend Engineer",
            CompanyName = "Acme Corp",
            SourceIdentifier = $"job-{Guid.NewGuid()}",
            TechnologyId = tech.Id,
            LocationId = loc.Id,
            ExperienceRangeId = exp.Id,
            JobListingSourceId = source.Id,
            LastSeenAt = lastSeen,
            IsActive = isActive,
            DataQualityStatus = "Valid",
            CollectedAtUtc = lastSeen.UtcDateTime
        };
    }

    private sealed class TestTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _utcNow;
        public TestTimeProvider(DateTimeOffset utcNow) => _utcNow = utcNow;
        public override DateTimeOffset GetUtcNow() => _utcNow;
    }
}
