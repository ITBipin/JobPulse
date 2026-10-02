namespace JobPulse.Application.Jobs;

public sealed record JobListingStatistics(
    int TotalActiveJobListings,
    int NewListingsLast7Days,
    int NewListingsLast30Days);