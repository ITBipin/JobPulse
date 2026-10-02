namespace JobPulse.Application.Dashboard;

public interface IMarketSnapshotService
{
    Task<MarketSnapshotCreationResult> CreateTodaysSnapshotAsync(
        CancellationToken cancellationToken = default);
}