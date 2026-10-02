namespace JobPulse.Application.JobSeekers;

public sealed record JobSeekerStatusUpdateResponse(string Status, DateTime LastConfirmedAt);