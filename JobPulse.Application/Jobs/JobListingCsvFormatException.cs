namespace JobPulse.Application.Jobs;

public sealed class JobListingCsvFormatException : Exception
{
    public JobListingCsvFormatException(string message) : base(message)
    {
    }
}