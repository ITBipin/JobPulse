namespace JobPulse.Application.Dashboard;

public interface IDashboardOverviewService
{
    Task<DashboardOverviewResponse> GetOverviewAsync(CancellationToken cancellationToken = default);
}
