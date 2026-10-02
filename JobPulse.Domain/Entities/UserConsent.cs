using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class UserConsent : EntityBase
{
    public Guid JobSeekerId { get; set; }
    public JobSeeker JobSeeker { get; set; } = default!;

    public string ConsentType { get; set; } = string.Empty;
    public bool IsGranted { get; set; }
    public DateTime GrantedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? RevokedAtUtc { get; set; }
    public string? ConsentVersion { get; set; }
    public string? Source { get; set; }
    public string DataQualityStatus { get; set; } = "Unknown";
}
