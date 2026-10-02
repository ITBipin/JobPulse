namespace JobPulse.Application.Jobs;

public interface IJobListingImportService
{
    Task<JobListingImportSummary> ImportCsvAsync(
        Stream csvData,
        CancellationToken cancellationToken = default);
}