namespace JobPulse.Domain.Entities;

public sealed class MarketSnapshot
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public DateOnly SnapshotDate { get; set; }
    public int ActiveTrackedJobs { get; set; }
    public int ActiveRegisteredJobSeekers { get; set; }
    public int NewJobsLast7Days { get; set; }
    public int NewJobsLast30Days { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}