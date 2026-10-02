namespace JobPulse.Application.JobSeekers;

public interface IActiveJobSeekerCountService
{
    Task<int> GetActiveJobSeekerCountAsync(CancellationToken cancellationToken = default);

    Task<int> GetActiveJobSeekerCountAsync(
        ActiveJobSeekerCountFilter filter,
        CancellationToken cancellationToken = default);
}