namespace JobPulse.Application.JobSeekers;

public sealed record ActiveJobSeekerCountFilter(
    Guid? TechnologyId = null,
    Guid? LocationId = null,
    Guid? ExperienceRangeId = null);