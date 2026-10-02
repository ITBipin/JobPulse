using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SnapshotWorker = JobPulse.Worker.Worker;

namespace JobPulse.Tests;

public class MarketSnapshotWorkerTests
{
    [Fact]
    public async Task StartAsync_CreatesScopeAndCallsSnapshotServiceImmediately()
    {
        var snapshotService = new ObservedSnapshotService(new MarketSnapshotCreationResult(
            new MarketSnapshotDto(Guid.NewGuid(), new DateOnly(2026, 10, 2), 0, 0, 0, 0, DateTimeOffset.UtcNow),
            WasCreated: true));
        var services = new ServiceCollection();
        services.AddScoped<IMarketSnapshotService>(_ => snapshotService);
        using var provider = services.BuildServiceProvider();
        var logger = new CapturingWorkerLogger();
        var worker = new SnapshotWorker(
            provider.GetRequiredService<IServiceScopeFactory>(),
            logger);

        await worker.StartAsync(CancellationToken.None);

        await snapshotService.Called.Task.WaitAsync(TimeSpan.FromSeconds(5));
        await snapshotService.Disposed.Task.WaitAsync(TimeSpan.FromSeconds(5));
        var information = await logger.InformationLogged.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.Equal(1, snapshotService.CallCount);
        Assert.True(snapshotService.CancellationToken.CanBeCanceled);
        Assert.Contains("Created market snapshot", information);

        await worker.StopAsync(CancellationToken.None);
    }

    [Fact]
    public async Task StartAsync_LogsFailureAndKeepsWorkerRunningUntilCancelled()
    {
        var snapshotService = new ObservedSnapshotService(exception: new InvalidOperationException("test failure"));
        var logger = new CapturingWorkerLogger();
        var services = new ServiceCollection();
        services.AddScoped<IMarketSnapshotService>(_ => snapshotService);
        using var provider = services.BuildServiceProvider();
        var worker = new SnapshotWorker(provider.GetRequiredService<IServiceScopeFactory>(), logger);

        await worker.StartAsync(CancellationToken.None);

        var loggedException = await logger.ErrorLogged.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.IsType<InvalidOperationException>(loggedException);
        Assert.NotNull(worker.ExecuteTask);
        Assert.False(worker.ExecuteTask.IsCompleted);

        await worker.StopAsync(CancellationToken.None);
    }

    [Fact]
    public async Task StartAsync_CallsJobListingExpiryServiceWhenRegistered()
    {
        var expiryService = new ObservedExpiryService();
        var snapshotService = new ObservedSnapshotService(new MarketSnapshotCreationResult(
            new MarketSnapshotDto(Guid.NewGuid(), new DateOnly(2026, 10, 2), 0, 0, 0, 0, DateTimeOffset.UtcNow),
            WasCreated: true));
        var services = new ServiceCollection();
        services.AddScoped<IJobListingExpiryService>(_ => expiryService);
        services.AddScoped<IMarketSnapshotService>(_ => snapshotService);
        using var provider = services.BuildServiceProvider();
        var logger = new CapturingWorkerLogger();
        var worker = new SnapshotWorker(
            provider.GetRequiredService<IServiceScopeFactory>(),
            logger);

        await worker.StartAsync(CancellationToken.None);

        await expiryService.Called.Task.WaitAsync(TimeSpan.FromSeconds(5));
        Assert.Equal(1, expiryService.CallCount);
        Assert.True(expiryService.CancellationToken.CanBeCanceled);

        await worker.StopAsync(CancellationToken.None);
    }

    private sealed class ObservedExpiryService : IJobListingExpiryService
    {
        public TaskCompletionSource<bool> Called { get; } = new(TaskCreationOptions.RunContinuationsAsynchronously);
        public CancellationToken CancellationToken { get; private set; }
        public int CallCount { get; private set; }

        public Task<JobListingExpiryResult> ExpireStaleJobListingsAsync(CancellationToken cancellationToken = default)
        {
            CallCount++;
            CancellationToken = cancellationToken;
            Called.TrySetResult(true);
            return Task.FromResult(new JobListingExpiryResult(5, 2));
        }
    }

    private sealed class ObservedSnapshotService : IMarketSnapshotService, IDisposable
    {
        private readonly MarketSnapshotCreationResult? _result;
        private readonly Exception? _exception;

        public ObservedSnapshotService(MarketSnapshotCreationResult result)
        {
            _result = result;
        }

        public ObservedSnapshotService(Exception exception)
        {
            _exception = exception;
        }

        public TaskCompletionSource<bool> Called { get; } = new(TaskCreationOptions.RunContinuationsAsynchronously);
        public TaskCompletionSource<bool> Disposed { get; } = new(TaskCreationOptions.RunContinuationsAsynchronously);
        public CancellationToken CancellationToken { get; private set; }
        public int CallCount { get; private set; }

        public Task<MarketSnapshotCreationResult> CreateTodaysSnapshotAsync(CancellationToken cancellationToken = default)
        {
            CallCount++;
            CancellationToken = cancellationToken;
            Called.TrySetResult(true);

            return _exception is not null
                ? Task.FromException<MarketSnapshotCreationResult>(_exception)
                : Task.FromResult(_result!);
        }

        public void Dispose() => Disposed.TrySetResult(true);
    }

    private sealed class CapturingWorkerLogger : ILogger<SnapshotWorker>
    {
        public TaskCompletionSource<string> InformationLogged { get; } = new(TaskCreationOptions.RunContinuationsAsynchronously);
        public TaskCompletionSource<Exception?> ErrorLogged { get; } = new(TaskCreationOptions.RunContinuationsAsynchronously);

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => NoopScope.Instance;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            if (logLevel == LogLevel.Information)
            {
                InformationLogged.TrySetResult(formatter(state, exception));
            }

            if (logLevel == LogLevel.Error)
            {
                ErrorLogged.TrySetResult(exception);
            }
        }
    }

    private sealed class NoopScope : IDisposable
    {
        public static NoopScope Instance { get; } = new();

        public void Dispose()
        {
        }
    }
}