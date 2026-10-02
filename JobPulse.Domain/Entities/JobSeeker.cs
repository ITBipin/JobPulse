using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class JobSeeker : EntityBase
{
    public string Source { get; set; } = string.Empty;
    public string? SourceIdentifier { get; set; }
    public DateTime CollectedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? OriginalRecordedDateUtc { get; set; }
    public string DataQualityStatus { get; set; } = "Unknown";
    public bool IsActive { get; set; } = true;
    public int? YearsOfExperience { get; set; }
    public Guid? ExperienceRangeId { get; set; }
    public ExperienceRange? ExperienceRange { get; set; }
    public Guid? LocationId { get; set; }
    public Location? Location { get; set; }
    public string JobSearchStatus { get; set; } = "Unknown";
    public DateTime? LastConfirmedAt { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public DateOnly? JobSearchStartDate { get; set; }
    public string? PreferredWorkMode { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }

    public ICollection<JobSeekerSkill> Skills { get; set; } = new List<JobSeekerSkill>();
    public ICollection<UserConsent> Consents { get; set; } = new List<UserConsent>();
}
