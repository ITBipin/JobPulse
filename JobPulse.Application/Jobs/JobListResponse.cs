namespace JobPulse.Application.Jobs;

public sealed record JobListResponse(
    IReadOnlyList<JobListItemDto> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages);
