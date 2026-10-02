using JobPulse.Domain.Common;

namespace JobPulse.Domain.Entities;

public class Technology : EntityBase
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<JobListing> JobListings { get; set; } = new List<JobListing>();
}
