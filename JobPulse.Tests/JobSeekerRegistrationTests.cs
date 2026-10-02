using System.ComponentModel.DataAnnotations;
using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.JobSeekers;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class JobSeekerRegistrationTests
{
    [Fact]
    public async Task RegisterAsync_SavesSeekerSkillsAndConsentAndReturnsSafeResponse()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new JobPulseDbContext(options);
        var experienceRange = new ExperienceRange { MinimumYears = 2, MaximumYears = 5, Label = "2-5 years" };
        var location = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var technologies = new[] { new Technology { Name = "C#" }, new Technology { Name = "SQL" } };
        context.ExperienceRanges.Add(experienceRange);
        context.Locations.Add(location);
        context.Technologies.AddRange(technologies);
        await context.SaveChangesAsync();

        var service = new JobSeekerRegistrationService(context);
        var result = await service.RegisterAsync(new RegisterJobSeekerRequest
        {
            ExperienceRangeId = experienceRange.Id,
            LocationId = location.Id,
            TechnologyIds = technologies.Select(x => x.Id).ToArray(),
            JobSearchStatus = "ActivelySearching",
            SalaryMin = 800000m,
            SalaryMax = 1200000m,
            JobSearchStartDate = new DateOnly(2026, 9, 1),
            Consent = true
        });

        Assert.NotNull(result);
        Assert.Equal("Registered", result.Status);
        Assert.Null(typeof(JobSeekerRegistrationResponse).GetProperty("Email"));
        Assert.Null(typeof(JobSeekerRegistrationResponse).GetProperty("Name"));

        var savedSeeker = await context.JobSeekers
            .Include(x => x.Skills)
            .Include(x => x.Consents)
            .SingleAsync();
        Assert.Equal("PublicRegistration", savedSeeker.Source);
        Assert.Equal("SelfReported", savedSeeker.DataQualityStatus);
        Assert.Equal(experienceRange.Id, savedSeeker.ExperienceRangeId);
        Assert.Equal(location.Id, savedSeeker.LocationId);
        Assert.Equal("Bengaluru", savedSeeker.City);
        Assert.Equal("ActivelySearching", savedSeeker.JobSearchStatus);
        Assert.Equal(800000m, savedSeeker.SalaryMin);
        Assert.Equal(1200000m, savedSeeker.SalaryMax);
        Assert.Equal(new DateOnly(2026, 9, 1), savedSeeker.JobSearchStartDate);
        Assert.Equal(2, savedSeeker.Skills.Count);
        Assert.Single(savedSeeker.Consents);
        Assert.True(savedSeeker.Consents.Single().IsGranted);
        Assert.Equal("JobSeekerRegistration", savedSeeker.Consents.Single().ConsentType);
    }

    [Fact]
    public void RegisterRequest_RejectsInvalidSalaryDateSelectionsAndMissingConsent()
    {
        var technologyId = Guid.NewGuid();
        var request = new RegisterJobSeekerRequest
        {
            ExperienceRangeId = Guid.NewGuid(),
            LocationId = Guid.NewGuid(),
            TechnologyIds = [technologyId, technologyId],
            SalaryMin = 1200000m,
            SalaryMax = 800000m,
            JobSearchStartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            Consent = false
        };
        var errors = new List<ValidationResult>();

        var isValid = Validator.TryValidateObject(request, new ValidationContext(request), errors, validateAllProperties: true);

        Assert.False(isValid);
        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.TechnologyIds)));
        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.SalaryMin)));
        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.JobSearchStartDate)));
        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.Consent)));

        var nullTechnologyRequest = request with
        {
            TechnologyIds = null,
            JobSearchStatus = "OpenToOffers",
            SalaryMin = 800000m,
            SalaryMax = 1200000m,
            JobSearchStartDate = DateOnly.FromDateTime(DateTime.UtcNow),
            Consent = true
        };
        var nullTechnologyErrors = new List<ValidationResult>();

        Assert.False(Validator.TryValidateObject(
            nullTechnologyRequest,
            new ValidationContext(nullTechnologyRequest),
            nullTechnologyErrors,
            validateAllProperties: true));
        Assert.Contains(nullTechnologyErrors, error => error.MemberNames.Contains(nameof(request.TechnologyIds)));
    }

    [Fact]
    public async Task RegisterAsync_DoesNotCreateSeekerWhenLookupIdsAreUnavailable()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new JobPulseDbContext(options);
        var service = new JobSeekerRegistrationService(context);
        var result = await service.RegisterAsync(new RegisterJobSeekerRequest
        {
            ExperienceRangeId = Guid.NewGuid(),
            LocationId = Guid.NewGuid(),
            TechnologyIds = [Guid.NewGuid()],
            JobSearchStatus = "OpenToOffers",
            Consent = true
        });

        Assert.Null(result);
        Assert.Empty(await context.JobSeekers.ToListAsync());
    }
}