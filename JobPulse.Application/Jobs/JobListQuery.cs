namespace JobPulse.Application.Jobs;

/// <summary>Query parameters for searching and filtering tracked job listings.</summary>
public sealed class JobListQuery
{
    /// <summary>Optional search term matched against job titles.</summary>
    public string? Search { get; set; }

    /// <summary>Optional technology name filter.</summary>
    public string? Technology { get; set; }

    /// <summary>Optional location city filter.</summary>
    public string? Location { get; set; }

    /// <summary>Optional experience range label filter.</summary>
    public string? Experience { get; set; }

    /// <summary>Optional filter for listings collected on or after this UTC date.</summary>
    public DateTime? FromDate { get; set; }

    /// <summary>Optional filter for listings collected on or before this UTC date.</summary>
    public DateTime? ToDate { get; set; }

    /// <summary>Page number for pagination (defaults to 1).</summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>Page size for pagination (defaults to 20, max 50).</summary>
    public int PageSize { get; set; } = 20;
}
