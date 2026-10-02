using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.JobSeekers;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class ActiveJobSeekerCountServiceTests
{
    private static readonly DateTimeOffset CurrentTime = new(2026, 10, 2, 12, 0, 0, TimeSpan.Zero);
    private static readonly JobSeekerActivityOptions Options = new(30);

    [Theory]
    [InlineData("OpenToWork", 29, 1)]
    [InlineData("OpenToWork", 31, 0)]
    [InlineData("NotLooking", 29, 0)]
    [InlineData("Hired", 29, 0)]
    public async Task GetActiveJobSeekerCountAsync_CountsOnlyOpenToWorkWithinConfirmationPeriod(
        string status,
        int daysSinceConfirmation,
        int expectedCount)
    {
        var (context, _) = await CreateContextWithSeekerAsync(
            status,
            CurrentTime.UtcDateTime.AddDays(-daysSinceConfirmation),
            consentGranted: true);
        await using (context)
        {
            var service = CreateService(context);

            var count = await service.GetActiveJobSeekerCountAsync();

            Assert.Equal(expectedCount, count);
        }
    }

    [Fact]
    public async Task GetActiveJobSeekerCountAsync_ExcludesMissingConfirmation()
    {
        var (context, _) = await CreateContextWithSeekerAsync(
            JobSeekerStatuses.OpenToWork,
            lastConfirmedAt: null,
            consentGranted: true);
        await using (context)
        {
            var service = CreateService(context);

            var count = await service.GetActiveJobSeekerCountAsync();

            Assert.Equal(0, count);
        }
    }

    [Fact]
    public async Task GetActiveJobSeekerCountAsync_ExcludesInvalidRegistration()
    {
        var (context, _) = await CreateContextWithSeekerAsync(
            JobSeekerStatuses.OpenToWork,
            CurrentTime.UtcDateTime.AddDays(-1),
            consentGranted: false);
        await using (context)
        {
            var service = CreateService(context);

            var count = await service.GetActiveJobSeekerCountAsync();

            Assert.Equal(0, count);
        }
    }

    private static ActiveJobSeekerCountService CreateService(JobPulseDbContext context) =>
        new(context, Options, new FixedTimeProvider(CurrentTime));

    private static async Task<(JobPulseDbContext Context, JobSeeker Seeker)> CreateContextWithSeekerAsync(
        string status,
        DateTime? lastConfirmedAt,
        bool consentGranted)
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new JobPulseDbContext(options);
        var experienceRange = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = "1-3 years" };
        var location = new Location { City = "Bengaluru", Country = "India" };
        var seeker = new JobSeeker
        {
            Source = "PublicRegistration",
            IsActive = true,
            JobSearchStatus = status,
            LastConfirmedAt = lastConfirmedAt,
            ExperienceRange = experienceRange,
            ExperienceRangeId = experienceRange.Id,
            Location = location,
            LocationId = location.Id,
            Consents =
            [
                new UserConsent
                {
                    ConsentType = "JobSeekerRegistration",
                    IsGranted = consentGranted,
                    GrantedAtUtc = CurrentTime.UtcDateTime,
                    RevokedAtUtc = consentGranted ? null : CurrentTime.UtcDateTime
                }
            ]
        };
        context.JobSeekers.Add(seeker);
        await context.SaveChangesAsync();
        return (context, seeker);
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