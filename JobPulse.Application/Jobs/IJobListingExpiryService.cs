namespace JobPulse.Application.Jobs;

/// <summary>
/// Summary of job listings processed and marked expired.
/// </summary>
public sealed record JobListingExpiryResult(int ProcessedCount, int ExpiredCount);

/// <summary>
/// Identifies and marks stale/expired job listings as inactive.
/// </summary>
public interface IJobListingExpiryService
{
    Task<JobListingExpiryResult> ExpireStaleJobListingsAsync(CancellationToken cancellationToken = default);
}
