namespace JobPulse.Application.Jobs;

/// <summary>Summary of a completed or processed CSV job listings import.</summary>
public sealed record JobListingImportSummary(
    int TotalRows,
    int ImportedRows,
    int SkippedRows,
    int DuplicateRows,
    int InvalidRows,
    IReadOnlyList<JobListingImportError> Errors)
{
    /// <summary>Identifier of the audit batch created for this import.</summary>
    public Guid? ImportBatchId { get; init; }
}

/// <summary>Error details for an individual invalid CSV row.</summary>
public sealed record JobListingImportError(int RowNumber, string Reason);