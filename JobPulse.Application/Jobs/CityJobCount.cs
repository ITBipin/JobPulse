namespace JobPulse.Application.Jobs;

public sealed record CityJobCount(Guid LocationId, string City, string? State, int JobCount);