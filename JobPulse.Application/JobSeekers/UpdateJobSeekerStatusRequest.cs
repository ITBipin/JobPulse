using System.ComponentModel.DataAnnotations;

namespace JobPulse.Application.JobSeekers;

public sealed record UpdateJobSeekerStatusRequest : IValidatableObject
{
    public Guid JobSeekerId { get; init; }
    public string? Status { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (JobSeekerId == Guid.Empty)
        {
            yield return new ValidationResult("A job seeker identifier is required.", [nameof(JobSeekerId)]);
        }

        if (!JobSeekerStatuses.IsSupported(Status))
        {
            yield return new ValidationResult(
                "Status must be OpenToWork, NotLooking, or Hired.",
                [nameof(Status)]);
        }
    }
}