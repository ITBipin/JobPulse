namespace JobPulse.Application.JobSeekers;

/// <summary>Active job seeker count from platform registrations, not a national market total.</summary>
public sealed record ActiveJobSeekerCountResponse(
    int Count,
    DateTimeOffset LastUpdated,
    string DataType,
    string Source,
    string Methodology)
{
    public string DataSource { get; init; } = "platform_registered";
}