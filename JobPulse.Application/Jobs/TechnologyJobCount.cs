namespace JobPulse.Application.Jobs;

public sealed record TechnologyJobCount(Guid TechnologyId, string TechnologyName, int JobCount);