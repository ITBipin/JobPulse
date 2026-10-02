using System.ComponentModel.DataAnnotations;

namespace JobPulse.Application.Dashboard;

/// <summary>Optional filters for market pressure ratio calculation.</summary>
public sealed record JobMarketPressureRatioQuery : IValidatableObject
{
    /// <summary>Optional technology identifier filter.</summary>
    public Guid? TechnologyId { get; init; }

    /// <summary>Optional location identifier filter.</summary>
    public Guid? LocationId { get; init; }

    /// <summary>Optional experience range identifier filter.</summary>
    public Guid? ExperienceRangeId { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (TechnologyId == Guid.Empty)
        {
            yield return new ValidationResult("TechnologyId must be a non-empty identifier.", [nameof(TechnologyId)]);
        }

        if (LocationId == Guid.Empty)
        {
            yield return new ValidationResult("LocationId must be a non-empty identifier.", [nameof(LocationId)]);
        }

        if (ExperienceRangeId == Guid.Empty)
        {
            yield return new ValidationResult("ExperienceRangeId must be a non-empty identifier.", [nameof(ExperienceRangeId)]);
        }
    }
}