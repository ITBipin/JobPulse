namespace JobPulse.Application.Jobs;

public sealed record JobListingDto(
    Guid Id,
    string Title,
    string CompanyName,
    string? JobUrl,
    string? SourceIdentifier,
    DateTime CollectedAtUtc,
    DateTime? OriginalPostedDateUtc,
    string DataQualityStatus,
    string? WorkMode,
    string? EmploymentType,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string? Description,
    JobTechnologyDto Technology,
    JobLocationDto Location,
    string ExperienceRange,
    JobSourceDto Source);

public sealed record JobTechnologyDto(Guid Id, string Name);

public sealed record JobLocationDto(Guid Id, string City, string? State, string Country, string? Region);

public sealed record JobSourceDto(Guid Id, string Name, string? WebsiteUrl);