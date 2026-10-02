using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class Location : EntityBase
{
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string Country { get; set; } = "India";
    public string? Region { get; set; }

    public ICollection<JobListing> JobListings { get; set; } = new List<JobListing>();
    public ICollection<JobSeeker> JobSeekers { get; set; } = new List<JobSeeker>();
}
