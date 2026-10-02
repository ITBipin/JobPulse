using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Jobs;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class JobListingStatisticsServiceTests
{
    private static readonly DateTimeOffset CurrentTime = new(2026, 10, 2, 12, 0, 0, TimeSpan.Zero);

    [Fact]
    public async Task GetStatisticsAsync_ReturnsTotalAndRecentListingCounts()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);

        context.JobListings.AddRange(
            CreateListing(CurrentTime.UtcDateTime),
            CreateListing(CurrentTime.UtcDateTime.AddDays(-7)),
            CreateListing(CurrentTime.UtcDateTime.AddDays(-8)),
            CreateListing(CurrentTime.UtcDateTime.AddDays(-30)),
            CreateListing(CurrentTime.UtcDateTime.AddDays(-31)));
        await context.SaveChangesAsync();

        var service = new JobListingStatisticsService(context, new FixedTimeProvider(CurrentTime));

        var result = await service.GetStatisticsAsync();

        Assert.Equal(5, result.TotalActiveJobListings);
        Assert.Equal(2, result.NewListingsLast7Days);
        Assert.Equal(4, result.NewListingsLast30Days);
    }

    private static JobListing CreateListing(DateTime collectedAtUtc) => new()
    {
        Title = "Software Engineer",
        CompanyName = "Example",
        CollectedAtUtc = collectedAtUtc,
        Technology = new Technology { Name = $"Technology-{Guid.NewGuid():N}" },
        Location = new Location { City = $"City-{Guid.NewGuid():N}", Country = "India" },
        ExperienceRange = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = $"Range-{Guid.NewGuid():N}" },
        JobListingSource = new JobListingSource { Name = $"Source-{Guid.NewGuid():N}" }
    };

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