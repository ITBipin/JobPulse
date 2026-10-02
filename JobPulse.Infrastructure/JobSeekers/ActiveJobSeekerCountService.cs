using JobPulse.Application.JobSeekers;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.JobSeekers;

public sealed class ActiveJobSeekerCountService : IActiveJobSeekerCountService
{
    private const string RegistrationConsentType = "JobSeekerRegistration";
    private readonly JobPulseDbContext _dbContext;
    private readonly JobSeekerActivityOptions _options;
    private readonly TimeProvider _timeProvider;

    public ActiveJobSeekerCountService(
        JobPulseDbContext dbContext,
        JobSeekerActivityOptions options,
        TimeProvider timeProvider)
    {
        ArgumentNullException.ThrowIfNull(dbContext);
        ArgumentNullException.ThrowIfNull(options);
        ArgumentNullException.ThrowIfNull(timeProvider);

        if (options.ConfirmationPeriodDays <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(options), "Confirmation period must be greater than zero days.");
        }

        _dbContext = dbContext;
        _options = options;
        _timeProvider = timeProvider;
    }

    public Task<int> GetActiveJobSeekerCountAsync(CancellationToken cancellationToken = default)
    {
        return GetActiveJobSeekerCountAsync(new ActiveJobSeekerCountFilter(), cancellationToken);
    }

    public Task<int> GetActiveJobSeekerCountAsync(
        ActiveJobSeekerCountFilter filter,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(filter);

        var nowUtc = _timeProvider.GetUtcNow().UtcDateTime;
        var confirmationCutoffUtc = nowUtc.AddDays(-_options.ConfirmationPeriodDays);

        var query = _dbContext.JobSeekers
            .AsNoTracking()
            .Where(jobSeeker =>
                jobSeeker.IsActive &&
                jobSeeker.JobSearchStatus == JobSeekerStatuses.OpenToWork &&
                jobSeeker.ExperienceRangeId.HasValue &&
                jobSeeker.LocationId.HasValue &&
                jobSeeker.LastConfirmedAt.HasValue &&
                jobSeeker.LastConfirmedAt.Value >= confirmationCutoffUtc &&
                jobSeeker.Consents.Any(consent =>
                    consent.ConsentType == RegistrationConsentType &&
                    consent.IsGranted &&
                    consent.RevokedAtUtc == null));

        if (filter.TechnologyId.HasValue)
        {
            query = query.Where(jobSeeker => jobSeeker.Skills.Any(skill => skill.TechnologyId == filter.TechnologyId.Value));
        }

        if (filter.LocationId.HasValue)
        {
            query = query.Where(jobSeeker => jobSeeker.LocationId == filter.LocationId.Value);
        }

        if (filter.ExperienceRangeId.HasValue)
        {
            query = query.Where(jobSeeker => jobSeeker.ExperienceRangeId == filter.ExperienceRangeId.Value);
        }

        return query.CountAsync(cancellationToken);
    }
}