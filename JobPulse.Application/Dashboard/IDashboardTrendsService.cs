namespace JobPulse.Application.Dashboard;

public interface IDashboardTrendsService
{
    Task<DashboardTrendsResponse> GetTrendsAsync(
        DashboardTrendsQuery query,
        CancellationToken cancellationToken = default);
}