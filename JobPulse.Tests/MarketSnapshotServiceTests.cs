using JobPulse.Application.Jobs;
using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Dashboard;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Jobs;
using JobPulse.Infrastructure.JobSeekers;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class MarketSnapshotServiceTests
{
    private static readonly DateTimeOffset CurrentTime = new(2026, 10, 1, 22, 30, 0, TimeSpan.FromHours(-5));

    [Fact]
    public async Task CreateTodaysSnapshotAsync_StoresCalculatedValuesAndUsesUtcSnapshotDate()
    {
        var context = await CreateContextWithMarketDataAsync();
        await using (context)
        {
            var service = CreateService(context);

            var result = await service.CreateTodaysSnapshotAsync();

            Assert.True(result.WasCreated);
            Assert.Equal(new DateOnly(2026, 10, 2), result.Snapshot.SnapshotDate);
            Assert.Equal(2, result.Snapshot.ActiveTrackedJobs);
            Assert.Equal(2, result.Snapshot.ActiveRegisteredJobSeekers);
            Assert.Equal(2, result.Snapshot.NewJobsLast7Days);
            Assert.Equal(3, result.Snapshot.NewJobsLast30Days);
            Assert.Equal(CurrentTime.UtcDateTime, result.Snapshot.CreatedAt.UtcDateTime);
        }
    }

    [Fact]
    public async Task CreateTodaysSnapshotAsync_ReturnsExistingSnapshotWithoutCreatingDuplicate()
    {
        var context = await CreateContextWithMarketDataAsync();
        await using (context)
        {
            var service = CreateService(context);

            var firstResult = await service.CreateTodaysSnapshotAsync();
            var secondResult = await service.CreateTodaysSnapshotAsync();

            Assert.True(firstResult.WasCreated);
            Assert.False(secondResult.WasCreated);
            Assert.Equal(firstResult.Snapshot.Id, secondResult.Snapshot.Id);
            Assert.Equal(1, await context.MarketSnapshots.CountAsync());
        }
    }

    [Fact]
    public async Task CreateTodaysSnapshotAsync_CreatesZeroValuedSnapshotForEmptyDatabase()
    {
        var context = CreateEmptyContext();
        await using (context)
        {
            var service = CreateService(context);

            var result = await service.CreateTodaysSnapshotAsync();

            Assert.True(result.WasCreated);
            Assert.Equal(0, result.Snapshot.ActiveTrackedJobs);
            Assert.Equal(0, result.Snapshot.ActiveRegisteredJobSeekers);
            Assert.Equal(0, result.Snapshot.NewJobsLast7Days);
            Assert.Equal(0, result.Snapshot.NewJobsLast30Days);
            Assert.Equal(1, await context.MarketSnapshots.CountAsync());
        }
    }

    [Fact]
    public async Task CreateTodaysSnapshotAsync_DoesNotOverwriteExistingSnapshot()
    {
        var context = CreateEmptyContext();
        await using (context)
        {
            var existing = new MarketSnapshot
            {
                SnapshotDate = new DateOnly(2026, 10, 2),
                ActiveTrackedJobs = 7,
                ActiveRegisteredJobSeekers = 4,
                NewJobsLast7Days = 3,
                NewJobsLast30Days = 6,
                CreatedAt = CurrentTime.UtcDateTime.AddHours(-1)
            };
            context.MarketSnapshots.Add(existing);
            await context.SaveChangesAsync();

            var result = await CreateService(context).CreateTodaysSnapshotAsync();

            Assert.False(result.WasCreated);
            Assert.Equal(existing.Id, result.Snapshot.Id);
            Assert.Equal(7, result.Snapshot.ActiveTrackedJobs);
            Assert.Equal(4, result.Snapshot.ActiveRegisteredJobSeekers);
            Assert.Equal(3, result.Snapshot.NewJobsLast7Days);
            Assert.Equal(6, result.Snapshot.NewJobsLast30Days);
            Assert.Equal(1, await context.MarketSnapshots.CountAsync());
        }
    }

    private static JobPulseDbContext CreateEmptyContext()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new JobPulseDbContext(options);
    }

    private static async Task<JobPulseDbContext> CreateContextWithMarketDataAsync()
    {
        var context = CreateEmptyContext();
        var csharp = new Technology { Name = "C#" };
        var python = new Technology { Name = "Python" };
        var bengaluru = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var pune = new Location { City = "Pune", State = "Maharashtra", Country = "India" };
        var junior = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = "1-3 years" };
        var senior = new ExperienceRange { MinimumYears = 4, MaximumYears = 8, Label = "4-8 years" };
        var source = new JobListingSource { Name = "SnapshotTestSource" };

        context.JobSeekers.AddRange(
            CreateActiveSeeker(csharp, bengaluru, junior),
            CreateActiveSeeker(python, pune, senior),
            new JobSeeker
            {
                Source = "PublicRegistration",
                IsActive = true,
                JobSearchStatus = JobSeekerStatuses.NotLooking,
                ExperienceRange = junior,
                Location = bengaluru,
                Consents = [new UserConsent { ConsentType = "JobSeekerRegistration", IsGranted = true }]
            });

        context.JobListings.AddRange(
            CreateListing(csharp, bengaluru, junior, source, CurrentTime.UtcDateTime.AddDays(-2), isActive: true),
            CreateListing(python, pune, senior, source, CurrentTime.UtcDateTime.AddDays(-10), isActive: true),
            CreateListing(csharp, bengaluru, junior, source, CurrentTime.UtcDateTime.AddDays(-1), isActive: false));

        await context.SaveChangesAsync();
        return context;
    }

    private static JobSeeker CreateActiveSeeker(
        Technology technology,
        Location location,
        ExperienceRange experienceRange) => new()
    {
        Source = "PublicRegistration",
        IsActive = true,
        JobSearchStatus = JobSeekerStatuses.OpenToWork,
        LastConfirmedAt = CurrentTime.UtcDateTime,
        CollectedAtUtc = CurrentTime.UtcDateTime,
        ExperienceRange = experienceRange,
        Location = location,
        Skills = [new JobSeekerSkill { Technology = technology, TechnologyId = technology.Id }],
        Consents =
        [
            new UserConsent
            {
                ConsentType = "JobSeekerRegistration",
                IsGranted = true,
                GrantedAtUtc = CurrentTime.UtcDateTime
            }
        ]
    };

    private static JobListing CreateListing(
        Technology technology,
        Location location,
        ExperienceRange experienceRange,
        JobListingSource source,
        DateTime collectedAtUtc,
        bool isActive) => new()
    {
        Title = "Engineer",
        CompanyName = "Example",
        IsActive = isActive,
        CollectedAtUtc = collectedAtUtc,
        Technology = technology,
        Location = location,
        ExperienceRange = experienceRange,
        JobListingSource = source
    };

    private static MarketSnapshotService CreateService(JobPulseDbContext context)
    {
        var clock = new FixedTimeProvider(CurrentTime);
        return new MarketSnapshotService(
            context,
            new ActiveJobSeekerCountService(context, new JobSeekerActivityOptions(30), clock),
            new JobListingStatisticsService(context, clock),
            clock);
    }

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