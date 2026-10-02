using JobPulse.Application.Dashboard;
using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Dashboard;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.JobSeekers;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class JobMarketPressureRatioServiceTests
{
    private static readonly DateTimeOffset CurrentTime = new(2026, 10, 2, 12, 0, 0, TimeSpan.Zero);

    [Fact]
    public async Task CalculateAsync_ReturnsFilteredPlatformRatioAndSampleMetadata()
    {
        var data = await CreateDatabaseAsync(includeSeekers: true, includeListings: true);
        await using var context = data.Context;
        var service = CreateService(context);

        var result = await service.CalculateAsync(new JobMarketPressureRatioQuery
        {
            TechnologyId = data.CSharpTechnologyId,
            LocationId = data.BengaluruLocationId,
            ExperienceRangeId = data.JuniorExperienceRangeId
        });

        Assert.Equal(1.5m, result.Ratio);
        Assert.True(result.IsAvailable);
        Assert.Equal(3, result.SampleSize.ActiveRegisteredJobSeekers);
        Assert.Equal(2, result.SampleSize.ActiveTrackedJobListings);
        Assert.Equal(data.CSharpTechnologyId, result.Filters.TechnologyId);
        Assert.Equal(data.BengaluruLocationId, result.Filters.LocationId);
        Assert.Equal(data.JuniorExperienceRangeId, result.Filters.ExperienceRangeId);
        Assert.Equal("platform_specific", result.Metadata.Scope);
        Assert.Equal("platform_tracked", result.DataSource);
        Assert.Equal("platform_ratio", result.DataType);
        Assert.Equal("platform_tracked", result.Metadata.DataSource);
        Assert.Equal("platform_ratio", result.Metadata.DataType);
        Assert.Contains("JobPulse", result.Metadata.Source);
        Assert.Contains("platform-specific", result.Metadata.Methodology, StringComparison.OrdinalIgnoreCase);
        Assert.Null(result.Metadata.UnavailableReason);
    }

    [Fact]
    public async Task CalculateAsync_ReturnsUnavailableWhenThereAreNoVacancies()
    {
        var data = await CreateDatabaseAsync(includeSeekers: true, includeListings: false);
        await using var context = data.Context;
        var service = CreateService(context);

        var result = await service.CalculateAsync(new JobMarketPressureRatioQuery());

        Assert.Null(result.Ratio);
        Assert.False(result.IsAvailable);
        Assert.Equal(4, result.SampleSize.ActiveRegisteredJobSeekers);
        Assert.Equal(0, result.SampleSize.ActiveTrackedJobListings);
        Assert.NotNull(result.Metadata.UnavailableReason);
    }

    [Fact]
    public async Task CalculateAsync_ReturnsZeroWhenThereAreNoSeekersButVacanciesExist()
    {
        var data = await CreateDatabaseAsync(includeSeekers: false, includeListings: true);
        await using var context = data.Context;
        var service = CreateService(context);

        var result = await service.CalculateAsync(new JobMarketPressureRatioQuery());

        Assert.Equal(0m, result.Ratio);
        Assert.True(result.IsAvailable);
        Assert.Equal(0, result.SampleSize.ActiveRegisteredJobSeekers);
        Assert.Equal(3, result.SampleSize.ActiveTrackedJobListings);
        Assert.Null(result.Metadata.UnavailableReason);
    }

    [Fact]
    public async Task CalculateAsync_ReturnsUnavailableWhenBothSampleSizesAreZero()
    {
        var data = await CreateDatabaseAsync(includeSeekers: false, includeListings: false);
        await using var context = data.Context;
        var service = CreateService(context);

        var result = await service.CalculateAsync(new JobMarketPressureRatioQuery());

        Assert.Null(result.Ratio);
        Assert.False(result.IsAvailable);
        Assert.Equal(0, result.SampleSize.ActiveRegisteredJobSeekers);
        Assert.Equal(0, result.SampleSize.ActiveTrackedJobListings);
    }

    private static JobMarketPressureRatioService CreateService(JobPulseDbContext context)
    {
        var countService = new ActiveJobSeekerCountService(
            context,
            new JobSeekerActivityOptions(30),
            new FixedTimeProvider(CurrentTime));
        return new JobMarketPressureRatioService(context, countService);
    }

    private static async Task<TestData> CreateDatabaseAsync(bool includeSeekers, bool includeListings)
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new JobPulseDbContext(options);

        var csharp = new Technology { Name = "C#" };
        var python = new Technology { Name = "Python" };
        var bengaluru = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var pune = new Location { City = "Pune", State = "Maharashtra", Country = "India" };
        var junior = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = "1-3 years" };
        var senior = new ExperienceRange { MinimumYears = 4, MaximumYears = 8, Label = "4-8 years" };
        var source = new JobListingSource { Name = "TestSource" };

        if (includeSeekers)
        {
            context.JobSeekers.AddRange(
                CreateSeeker(csharp, bengaluru, junior),
                CreateSeeker(csharp, bengaluru, junior),
                CreateSeeker(csharp, bengaluru, junior),
                CreateSeeker(python, pune, senior));
        }

        if (includeListings)
        {
            context.JobListings.AddRange(
                CreateListing(csharp, bengaluru, junior, source, isActive: true),
                CreateListing(csharp, bengaluru, junior, source, isActive: true),
                CreateListing(python, pune, senior, source, isActive: true),
                CreateListing(csharp, bengaluru, junior, source, isActive: false));
        }

        await context.SaveChangesAsync();
        return new TestData(context, csharp.Id, bengaluru.Id, junior.Id);
    }

    private static JobSeeker CreateSeeker(Technology technology, Location location, ExperienceRange experienceRange) => new()
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
        bool isActive) => new()
    {
        Title = "Engineer",
        CompanyName = "Example",
        IsActive = isActive,
        Technology = technology,
        Location = location,
        ExperienceRange = experienceRange,
        JobListingSource = source
    };

    private sealed record TestData(
        JobPulseDbContext Context,
        Guid CSharpTechnologyId,
        Guid BengaluruLocationId,
        Guid JuniorExperienceRangeId);

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