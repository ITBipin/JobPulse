using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class JobListing : EntityBase
{
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? JobUrl { get; set; }
    public string? SourceIdentifier { get; set; }
    public DateTime CollectedAtUtc { get; set; } = DateTime.UtcNow;

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTime CollectedAt
    {
        get => CollectedAtUtc;
        set => CollectedAtUtc = value;
    }

    public DateTimeOffset LastSeenAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTime? OriginalPostedDateUtc { get; set; }
    public bool IsActive { get; set; } = true;
    public string DataQualityStatus { get; set; } = "Unknown";
    public string? WorkMode { get; set; }
    public string? EmploymentType { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public string? Description { get; set; }

    public Guid TechnologyId { get; set; }
    public Technology Technology { get; set; } = default!;

    public Guid LocationId { get; set; }
    public Location Location { get; set; } = default!;

    public Guid ExperienceRangeId { get; set; }
    public ExperienceRange ExperienceRange { get; set; } = default!;

    public Guid JobListingSourceId { get; set; }
    public JobListingSource JobListingSource { get; set; } = default!;
}
