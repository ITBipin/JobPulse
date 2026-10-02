namespace JobPulse.Application.Jobs;

public sealed record JobListItemDto(
    Guid Id,
    string Title,
    string CompanyName,
    string Technology,
    string Location,
    string ExperienceRange,
    string Source,
    DateTime CollectedAtUtc,
    DateTime? OriginalPostedDateUtc,
    string? EmploymentType,
    string? WorkMode,
    string? JobUrl,
    string DataQualityStatus);
