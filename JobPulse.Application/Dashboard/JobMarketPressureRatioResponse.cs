namespace JobPulse.Application.Dashboard;

public sealed record JobMarketPressureRatioResponse(
    decimal? Ratio,
    bool IsAvailable,
    JobMarketPressureSampleSize SampleSize,
    JobMarketPressureFilters Filters,
    JobMarketPressureMetadata Metadata)
{
    public string DataSource { get; init; } = "platform_tracked";
    public string DataType { get; init; } = "platform_ratio";
}

public sealed record JobMarketPressureSampleSize(
    int ActiveRegisteredJobSeekers,
    int ActiveTrackedJobListings);

public sealed record JobMarketPressureFilters(
    Guid? TechnologyId,
    Guid? LocationId,
    Guid? ExperienceRangeId);

public sealed record JobMarketPressureMetadata(
    string Scope,
    string Source,
    string Methodology,
    string? UnavailableReason)
{
    public string DataSource { get; init; } = "platform_tracked";
    public string DataType { get; init; } = "platform_ratio";
}