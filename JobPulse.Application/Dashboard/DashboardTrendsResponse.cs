namespace JobPulse.Application.Dashboard;

/// <summary>Historical dashboard snapshots and the bounds/source for the returned series.</summary>
public sealed class DashboardTrendsResponse
{
    public DateOnly From { get; init; }
    public DateOnly To { get; init; }
    public string DataSource { get; init; } = "platform_snapshots";
    public string DataType { get; init; } = "historical_snapshot";
    public DateTimeOffset? LastUpdated { get; init; }
    public IReadOnlyList<DashboardTrendPoint> Data { get; init; } = [];
}

public sealed class DashboardTrendPoint
{
    public DateOnly SnapshotDate { get; init; }
    public int ActiveTrackedJobs { get; init; }
    public int ActiveRegisteredJobSeekers { get; init; }
    public int NewJobsLast7Days { get; init; }
    public int NewJobsLast30Days { get; init; }
}