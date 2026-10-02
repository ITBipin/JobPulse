namespace JobPulse.Application.Dashboard;

public sealed record MarketSnapshotDto(
    Guid Id,
    DateOnly SnapshotDate,
    int ActiveTrackedJobs,
    int ActiveRegisteredJobSeekers,
    int NewJobsLast7Days,
    int NewJobsLast30Days,
    DateTimeOffset CreatedAt);

public sealed record MarketSnapshotCreationResult(MarketSnapshotDto Snapshot, bool WasCreated);