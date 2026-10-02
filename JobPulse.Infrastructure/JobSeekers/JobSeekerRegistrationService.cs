using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.JobSeekers;

public sealed class JobSeekerRegistrationService : IJobSeekerRegistrationService
{
    private const string RegistrationSource = "PublicRegistration";
    private readonly JobPulseDbContext _dbContext;

    public JobSeekerRegistrationService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<JobSeekerRegistrationResponse?> RegisterAsync(
        RegisterJobSeekerRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.TechnologyIds is null)
        {
            return null;
        }

        var experienceRange = await _dbContext.ExperienceRanges
            .FirstOrDefaultAsync(x => x.Id == request.ExperienceRangeId, cancellationToken);
        var location = await _dbContext.Locations
            .FirstOrDefaultAsync(x => x.Id == request.LocationId, cancellationToken);
        var distinctTechnologyIds = request.TechnologyIds.Distinct().ToArray();
        var technologyCount = await _dbContext.Technologies
            .CountAsync(x => distinctTechnologyIds.Contains(x.Id), cancellationToken);

        if (experienceRange is null || location is null || technologyCount != distinctTechnologyIds.Length)
        {
            return null;
        }

        var registeredAtUtc = DateTime.UtcNow;
        var jobSeeker = new JobSeeker
        {
            Source = RegistrationSource,
            DataQualityStatus = "SelfReported",
            CollectedAtUtc = registeredAtUtc,
            IsActive = true,
            ExperienceRangeId = experienceRange.Id,
            LocationId = location.Id,
            City = location.City,
            State = location.State,
            JobSearchStatus = request.JobSearchStatus.Trim(),
            SalaryMin = request.SalaryMin,
            SalaryMax = request.SalaryMax,
            JobSearchStartDate = request.JobSearchStartDate,
            Skills = distinctTechnologyIds.Select(technologyId => new JobSeekerSkill
            {
                TechnologyId = technologyId,
                Source = RegistrationSource,
                LastUpdatedUtc = registeredAtUtc
            }).ToList(),
            Consents =
            [
                new UserConsent
                {
                    ConsentType = "JobSeekerRegistration",
                    IsGranted = true,
                    GrantedAtUtc = registeredAtUtc,
                    Source = RegistrationSource,
                    DataQualityStatus = "SelfReported"
                }
            ]
        };

        _dbContext.JobSeekers.Add(jobSeeker);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new JobSeekerRegistrationResponse("Registered", registeredAtUtc);
    }
}