using JobPulse.Application.Jobs;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace JobPulse.Infrastructure.Jobs;

public sealed class JobListingExpiryService : IJobListingExpiryService
{
    private readonly JobPulseDbContext _dbContext;
    private readonly JobFreshnessOptions _freshnessOptions;
    private readonly TimeProvider _timeProvider;
    private readonly ILogger<JobListingExpiryService> _logger;

    public JobListingExpiryService(
        JobPulseDbContext dbContext,
        JobFreshnessOptions freshnessOptions,
        TimeProvider timeProvider,
        ILogger<JobListingExpiryService> logger)
    {
        _dbContext = dbContext;
        _freshnessOptions = freshnessOptions;
        _timeProvider = timeProvider;
        _logger = logger;
    }

    public async Task<JobListingExpiryResult> ExpireStaleJobListingsAsync(CancellationToken cancellationToken = default)
    {
        var now = _timeProvider.GetUtcNow();
        var expiredCutoff = now - _freshnessOptions.StaleFor;

        var activeListings = await _dbContext.JobListings
            .Where(listing => listing.IsActive)
            .ToListAsync(cancellationToken);

        var processedCount = activeListings.Count;
        var expiredListings = activeListings
            .Where(listing => listing.LastSeenAt < expiredCutoff)
            .ToList();

        foreach (var listing in expiredListings)
        {
            listing.IsActive = false;
        }

        if (expiredListings.Count > 0)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation(
            "Job expiry processing complete. Evaluated {ProcessedCount} active listings; marked {ExpiredCount} as inactive.",
            processedCount,
            expiredListings.Count);

        return new JobListingExpiryResult(processedCount, expiredListings.Count);
    }
}
