namespace JobPulse.Application.JobSeekers;

public interface IJobSeekerStatusService
{
    Task<JobSeekerStatusUpdateResponse?> UpdateStatusAsync(
        UpdateJobSeekerStatusRequest request,
        CancellationToken cancellationToken = default);
}