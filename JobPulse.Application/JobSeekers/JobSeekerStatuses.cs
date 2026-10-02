namespace JobPulse.Application.JobSeekers;

public static class JobSeekerStatuses
{
    public const string OpenToWork = "OpenToWork";
    public const string NotLooking = "NotLooking";
    public const string Hired = "Hired";

    public static bool IsSupported(string? status) =>
        status is OpenToWork or NotLooking or Hired;
}