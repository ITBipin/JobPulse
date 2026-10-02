using System.ComponentModel.DataAnnotations;

namespace JobPulse.Application.Dashboard;

/// <summary>Filters stored dashboard snapshots to an optional date range.</summary>
public sealed record DashboardTrendsQuery : IValidatableObject
{
    /// <summary>Start date in YYYY-MM-DD format (inclusive).</summary>
    public DateOnly? From { get; init; }

    /// <summary>End date in YYYY-MM-DD format (inclusive).</summary>
    public DateOnly? To { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (From.HasValue && To.HasValue && From.Value > To.Value)
        {
            yield return new ValidationResult("From must be on or before To.", [nameof(From), nameof(To)]);
        }
    }
}