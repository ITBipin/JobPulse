namespace JobPulse.Application.Jobs;

public interface IJobListService
{
    Task<JobListResponse> GetJobsAsync(JobListQuery query, CancellationToken cancellationToken = default);
    Task<JobListingDto?> GetJobByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
