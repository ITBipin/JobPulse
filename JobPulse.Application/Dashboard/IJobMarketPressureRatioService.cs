namespace JobPulse.Application.Dashboard;

public interface IJobMarketPressureRatioService
{
    Task<JobMarketPressureRatioResponse> CalculateAsync(
        JobMarketPressureRatioQuery query,
        CancellationToken cancellationToken = default);
}