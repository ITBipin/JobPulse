using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using Microsoft.Extensions.DependencyInjection;

namespace JobPulse.Worker;

public class Worker : BackgroundService
{
    private static readonly TimeSpan SnapshotInterval = TimeSpan.FromHours(24);
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<Worker> _logger;

    public Worker(IServiceScopeFactory scopeFactory, ILogger<Worker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await TryExpireListingsAsync(stoppingToken);
            await TryCreateSnapshotAsync(stoppingToken);

            if (stoppingToken.IsCancellationRequested)
            {
                break;
            }

            try
            {
                await Task.Delay(SnapshotInterval, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }
    }

    private async Task TryExpireListingsAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var expiryService = scope.ServiceProvider.GetService<IJobListingExpiryService>();
            if (expiryService is null)
            {
                return;
            }

            var result = await expiryService.ExpireStaleJobListingsAsync(cancellationToken);
            if (result.ExpiredCount > 0)
            {
                _logger.LogInformation(
                    "Expired {ExpiredCount} stale job listings out of {ProcessedCount} active listings.",
                    result.ExpiredCount,
                    result.ProcessedCount);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Job listing expiry check failed. The worker will retry at its next scheduled run.");
        }
    }

    private async Task TryCreateSnapshotAsync(CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var snapshotService = scope.ServiceProvider.GetRequiredService<IMarketSnapshotService>();
            var result = await snapshotService.CreateTodaysSnapshotAsync(cancellationToken);

            if (result.WasCreated)
            {
                _logger.LogInformation(
                    "Created market snapshot {SnapshotId} for {SnapshotDate}.",
                    result.Snapshot.Id,
                    result.Snapshot.SnapshotDate);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Market snapshot check failed. The worker will retry at its next scheduled run.");
        }
    }
}
