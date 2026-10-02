using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Dashboard;
using JobPulse.Infrastructure.Jobs;
using JobPulse.Infrastructure.JobSeekers;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class DashboardOverviewServiceTests
{
    [Fact]
    public async Task GetOverviewAsync_ComposesExistingDatabaseAnalytics()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new JobPulseDbContext(options);

        var technology = new Technology { Name = "C#" };
        var sourceOne = new JobListingSource { Name = "Naukri" };
        var sourceTwo = new JobListingSource { Name = "LinkedIn" };
        var location = new Location { City = "Bengaluru", Country = "India" };
        var experience = new ExperienceRange { MinimumYears = 2, MaximumYears = 5, Label = "2-5 years" };

        context.Technologies.Add(technology);
        context.JobListingSources.AddRange(sourceOne, sourceTwo);
        context.Locations.Add(location);
        context.ExperienceRanges.Add(experience);

        context.JobSeekers.AddRange(
            new JobSeeker
            {
                Source = "Naukri",
                IsActive = true,
                JobSearchStatus = JobSeekerStatuses.OpenToWork,
                LastConfirmedAt = new DateTime(2026, 9, 15, 10, 0, 0, DateTimeKind.Utc),
                ExperienceRange = experience,
                Location = location,
                CollectedAtUtc = new DateTime(2026, 9, 15, 10, 0, 0, DateTimeKind.Utc),
                DataQualityStatus = "Verified",
                Consents = [new UserConsent { ConsentType = "JobSeekerRegistration", IsGranted = true }]
            },
            new JobSeeker
            {
                Source = "LinkedIn",
                IsActive = true,
                JobSearchStatus = JobSeekerStatuses.OpenToWork,
                LastConfirmedAt = new DateTime(2026, 9, 14, 10, 0, 0, DateTimeKind.Utc),
                ExperienceRange = experience,
                Location = location,
                CollectedAtUtc = new DateTime(2026, 9, 14, 10, 0, 0, DateTimeKind.Utc),
                DataQualityStatus = "Verified",
                Consents = [new UserConsent { ConsentType = "JobSeekerRegistration", IsGranted = true }]
            },
            new JobSeeker
            {
                Source = "Naukri",
                IsActive = false,
                CollectedAtUtc = new DateTime(2026, 9, 13, 10, 0, 0, DateTimeKind.Utc),
                DataQualityStatus = "Verified"
            });

        context.JobListings.AddRange(
            new JobListing
            {
                Title = "Senior Developer",
                CompanyName = "Contoso",
                Technology = technology,
                Location = location,
                ExperienceRange = experience,
                JobListingSource = sourceOne,
                CollectedAtUtc = new DateTime(2026, 9, 16, 8, 0, 0, DateTimeKind.Utc)
            },
            new JobListing
            {
                Title = "Platform Engineer",
                CompanyName = "Acme",
                Technology = technology,
                Location = location,
                ExperienceRange = experience,
                JobListingSource = sourceTwo,
                CollectedAtUtc = new DateTime(2026, 9, 15, 8, 0, 0, DateTimeKind.Utc)
            },
            new JobListing
            {
                Title = "QA Analyst",
                CompanyName = "Example",
                Technology = technology,
                Location = location,
                ExperienceRange = experience,
                JobListingSource = sourceOne,
                CollectedAtUtc = new DateTime(2026, 9, 13, 8, 0, 0, DateTimeKind.Utc)
            });

        await context.SaveChangesAsync();

        var timeProvider = new FixedTimeProvider(new DateTimeOffset(2026, 10, 2, 12, 0, 0, TimeSpan.Zero));
        var service = new DashboardOverviewService(
            context,
            new ActiveJobSeekerCountService(context, new JobSeekerActivityOptions(30), timeProvider),
            new JobListingStatisticsService(context, timeProvider),
            new ActiveJobListingsByTechnologyService(context),
            new ActiveJobListingsByCityService(context));

        var result = await service.GetOverviewAsync();

        Assert.Equal("platform_tracked", result.DataSource);
        Assert.Equal(2, result.ActiveRegisteredJobSeekers);
        Assert.Equal(3, result.ActiveTrackedJobListings);
        Assert.Equal(0, result.NewListingsLast7Days);
        Assert.Equal(3, result.NewListingsLast30Days);
        Assert.Equal(new DateTime(2026, 9, 16, 8, 0, 0, DateTimeKind.Utc), result.LastDataUpdate);
        Assert.Single(result.TopTechnologies);
        Assert.Equal("C#", result.TopTechnologies[0].TechnologyName);
        Assert.Equal(3, result.TopTechnologies[0].JobCount);
        Assert.Single(result.TopLocations);
        Assert.Equal("Bengaluru", result.TopLocations[0].City);
        Assert.Equal(3, result.TopLocations[0].JobCount);
    }

    private sealed class FixedTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _currentTime;

        public FixedTimeProvider(DateTimeOffset currentTime)
        {
            _currentTime = currentTime;
        }

        public override DateTimeOffset GetUtcNow() => _currentTime;
    }
}
