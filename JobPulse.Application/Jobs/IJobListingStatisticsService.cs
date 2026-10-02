namespace JobPulse.Application.Jobs;

public interface IJobListingStatisticsService
{
    Task<JobListingStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default);
}