using JobPulse.Application.Jobs;

namespace JobPulse.Application.Dashboard;

public sealed record DashboardOverviewResponse(
    int ActiveRegisteredJobSeekers,
    int ActiveTrackedJobListings,
    int NewListingsLast7Days,
    int NewListingsLast30Days,
    IReadOnlyList<TechnologyJobCount> TopTechnologies,
    IReadOnlyList<CityJobCount> TopLocations,
    DateTime? LastDataUpdate)
{
    public string DataSource { get; init; } = "platform_tracked";
    public string DataType { get; init; } = "platform_overview";
}
