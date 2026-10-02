using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class JobSeekerSkill : EntityBase
{
    public Guid JobSeekerId { get; set; }
    public JobSeeker JobSeeker { get; set; } = default!;

    public Guid TechnologyId { get; set; }
    public Technology Technology { get; set; } = default!;

    public int? YearsOfExperience { get; set; }
    public int? ProficiencyLevel { get; set; }
    public DateTime LastUpdatedUtc { get; set; } = DateTime.UtcNow;
    public string? Source { get; set; }
}
