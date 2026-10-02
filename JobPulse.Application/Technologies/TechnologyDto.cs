namespace JobPulse.Application.Technologies;

/// <summary>Technology lookup information exposed by the API.</summary>
public sealed record TechnologyDto(Guid Id, string Name, bool IsActive);