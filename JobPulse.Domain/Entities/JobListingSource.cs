using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class JobListingSource : EntityBase
{
    public string Name { get; set; } = string.Empty;
    public string? SourceType { get; set; }
    public DateTimeOffset? LastSuccessfulCollectionAt { get; set; }
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTimeOffset? LastSuccessfulImportTime
    {
        get => LastSuccessfulCollectionAt;
        set => LastSuccessfulCollectionAt = value;
    }
    public string? WebsiteUrl { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTime CreatedAt => CreatedAtUtc;

    public ICollection<JobListing> JobListings { get; set; } = new List<JobListing>();
    public ICollection<JobImportBatch> ImportBatches { get; set; } = new List<JobImportBatch>();
}
