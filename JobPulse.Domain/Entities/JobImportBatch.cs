using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class JobImportBatch : EntityBase
{
    public Guid? SourceId { get; set; }
    public JobListingSource? Source { get; set; }

    public DateTimeOffset StartedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? CompletedAt { get; set; }

    public int TotalRows { get; set; }
    public int ImportedRows { get; set; }
    public int DuplicateRows { get; set; }
    public int InvalidRows { get; set; }
    public int SkippedRows { get; set; }

    public string Status { get; set; } = JobImportBatchStatuses.Started;
    public string? ErrorMessage { get; set; }
}

public static class JobImportBatchStatuses
{
    public const string Started = "Started";
    public const string Completed = "Completed";
    public const string Failed = "Failed";
}
