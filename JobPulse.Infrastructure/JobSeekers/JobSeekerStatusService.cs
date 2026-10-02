using JobPulse.Application.JobSeekers;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.JobSeekers;

public sealed class JobSeekerStatusService : IJobSeekerStatusService
{
    private readonly JobPulseDbContext _dbContext;

    public JobSeekerStatusService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<JobSeekerStatusUpdateResponse?> UpdateStatusAsync(
        UpdateJobSeekerStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.JobSeekerId == Guid.Empty || !JobSeekerStatuses.IsSupported(request.Status))
        {
            throw new ArgumentException("A valid job seeker ID and supported status are required.", nameof(request));
        }

        var jobSeeker = await _dbContext.JobSeekers
            .FirstOrDefaultAsync(x => x.Id == request.JobSeekerId, cancellationToken);

        if (jobSeeker is null)
        {
            return null;
        }

        var lastConfirmedAt = DateTime.UtcNow;
        jobSeeker.JobSearchStatus = request.Status!;
        jobSeeker.LastConfirmedAt = lastConfirmedAt;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new JobSeekerStatusUpdateResponse(jobSeeker.JobSearchStatus, lastConfirmedAt);
    }
}