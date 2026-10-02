namespace JobPulse.Application.JobSeekers;

public interface IJobSeekerRegistrationService
{
    Task<JobSeekerRegistrationResponse?> RegisterAsync(
        RegisterJobSeekerRequest request,
        CancellationToken cancellationToken = default);
}