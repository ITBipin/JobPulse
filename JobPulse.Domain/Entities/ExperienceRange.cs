using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class ExperienceRange : EntityBase
{
    public int MinimumYears { get; set; }
    public int? MaximumYears { get; set; }
    public string Label { get; set; } = string.Empty;

    public ICollection<JobListing> JobListings { get; set; } = new List<JobListing>();
    public ICollection<JobSeeker> JobSeekers { get; set; } = new List<JobSeeker>();
}
