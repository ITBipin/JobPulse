namespace JobPulse.Application.Locations;

/// <summary>Location lookup information exposed by the API.</summary>
public sealed record LocationDto(Guid Id, string City, string? State, string Country);