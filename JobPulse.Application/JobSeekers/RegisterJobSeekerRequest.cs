using System.ComponentModel.DataAnnotations;

namespace JobPulse.Application.JobSeekers;

public sealed record RegisterJobSeekerRequest : IValidatableObject
{
    public Guid ExperienceRangeId { get; init; }
    public Guid LocationId { get; init; }
    public IReadOnlyList<Guid>? TechnologyIds { get; init; } = Array.Empty<Guid>();
    public string JobSearchStatus { get; init; } = string.Empty;
    public decimal? SalaryMin { get; init; }
    public decimal? SalaryMax { get; init; }
    public DateOnly? JobSearchStartDate { get; init; }
    public bool Consent { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ExperienceRangeId == Guid.Empty)
        {
            yield return new ValidationResult("An experience range is required.", [nameof(ExperienceRangeId)]);
        }

        if (LocationId == Guid.Empty)
        {
            yield return new ValidationResult("A location is required.", [nameof(LocationId)]);
        }

        if (TechnologyIds is null || TechnologyIds.Count == 0 || TechnologyIds.Count > 100 || TechnologyIds.Any(id => id == Guid.Empty))
        {
            yield return new ValidationResult("Select between 1 and 100 valid technologies.", [nameof(TechnologyIds)]);
        }
        else if (TechnologyIds.Distinct().Count() != TechnologyIds.Count)
        {
            yield return new ValidationResult("Technology selections must not contain duplicates.", [nameof(TechnologyIds)]);
        }

        if (string.IsNullOrWhiteSpace(JobSearchStatus) || JobSearchStatus.Length > 50)
        {
            yield return new ValidationResult("A job search status of 1 to 50 characters is required.", [nameof(JobSearchStatus)]);
        }

        const decimal maximumSalary = 9999999999999999.99m;
        if (SalaryMin is < 0 or > maximumSalary || SalaryMax is < 0 or > maximumSalary ||
            SalaryMin.HasValue && SalaryMax.HasValue && SalaryMin > SalaryMax)
        {
            yield return new ValidationResult("The optional salary range is invalid.", [nameof(SalaryMin), nameof(SalaryMax)]);
        }

        if (JobSearchStartDate > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            yield return new ValidationResult("The job search start date cannot be in the future.", [nameof(JobSearchStartDate)]);
        }

        if (!Consent)
        {
            yield return new ValidationResult("Consent is required to register.", [nameof(Consent)]);
        }
    }
}