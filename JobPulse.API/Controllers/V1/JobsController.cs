using JobPulse.Application.Jobs;
using Microsoft.AspNetCore.Mvc;

namespace JobPulse.API.Controllers.V1;

/// <summary>
/// Provides operations for querying tracked job listings, inspecting data freshness, and importing CSV listings.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public sealed class JobsController : ControllerBase
{
    private const long MaximumCsvFileSizeBytes = 10 * 1024 * 1024;
    private readonly IJobListService _jobListService;
    private readonly IJobListingImportService _jobListingImportService;
    private readonly IJobDataFreshnessService _freshnessService;

    public JobsController(IJobListService jobListService, IJobListingImportService jobListingImportService, IJobDataFreshnessService freshnessService)
    {
        _jobListService = jobListService;
        _jobListingImportService = jobListingImportService;
        _freshnessService = freshnessService;
    }

    /// <summary>
    /// Retrieves freshness status for a tracked job listing.
    /// </summary>
    /// <remarks>
    /// Evaluates collection and last seen timestamps against configurable thresholds to determine if the listing is Fresh, Stale, or Expired ('platform_tracked').
    /// </remarks>
    /// <param name="id">Unique identifier of the job listing.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Freshness information for the job listing.</response>
    /// <response code="404">Job listing not found.</response>
    [HttpGet("{id:guid}/freshness")]
    [ProducesResponseType(typeof(JobFreshnessDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<JobFreshnessDto>> GetFreshness(Guid id, CancellationToken cancellationToken)
    {
        var freshness = await _freshnessService.GetJobFreshnessAsync(id, cancellationToken);
        return freshness is null ? NotFound() : Ok(freshness);
    }

    /// <summary>
    /// Searches and filters active tracked job listings.
    /// </summary>
    /// <remarks>
    /// Returns a paginated list of active tracked job listings ('platform_tracked') ordered newest first.
    /// </remarks>
    /// <param name="query">Filtering criteria including search term, technology, location, experience range, date range, and pagination.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Paginated list of tracked job listings.</response>
    [HttpGet]
    [ProducesResponseType(typeof(JobListResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<JobListResponse>> GetJobs([FromQuery] JobListQuery query, CancellationToken cancellationToken)
    {
        var jobs = await _jobListService.GetJobsAsync(query, cancellationToken);
        return Ok(jobs);
    }

    /// <summary>
    /// Retrieves details of a specific tracked job listing by ID.
    /// </summary>
    /// <remarks>
    /// Returns full listing metadata ('platform_tracked') including company name, technology, location, experience, and source feed.
    /// </remarks>
    /// <param name="id">Unique identifier of the job listing.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Job listing details.</response>
    /// <response code="404">Job listing not found.</response>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(JobListingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<JobListingDto>> GetJobById(Guid id, CancellationToken cancellationToken)
    {
        var job = await _jobListService.GetJobByIdAsync(id, cancellationToken);
        return job is null ? NotFound() : Ok(job);
    }

    /// <summary>
    /// Imports job listings from an uploaded CSV file.
    /// </summary>
    /// <remarks>
    /// Uploads a CSV file using multipart/form-data to import or update tracked job listings ('platform_tracked').
    /// Validates required headers, maps fields, sets collection and last seen timestamps, and deduplicates records.
    /// </remarks>
    /// <param name="request">Multipart form request containing the CSV file.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Import summary detailing processed, imported, duplicate, skipped, and invalid rows.</response>
    /// <response code="400">File is missing, has an invalid MIME/extension, or contains malformed CSV content.</response>
    /// <response code="413">File exceeds the 10 MiB maximum allowed size.</response>
    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(MaximumCsvFileSizeBytes)]
    [ProducesResponseType(typeof(JobListingImportSummary), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status413PayloadTooLarge)]
    public async Task<ActionResult<JobListingImportSummary>> ImportCsv(
        [FromForm] JobListingImportRequest request,
        CancellationToken cancellationToken)
    {
        var file = request?.File;
        if (file is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "CSV file is required",
                Detail = "Upload a CSV file using the 'file' form field."
            });
        }

        if (file.Length > MaximumCsvFileSizeBytes)
        {
            return StatusCode(StatusCodes.Status413PayloadTooLarge, new ProblemDetails
            {
                Title = "CSV file is too large",
                Detail = "The maximum CSV upload size is 10 MiB."
            });
        }

        var extension = Path.GetExtension(file.FileName);
        var contentType = file.ContentType.Split(';', 2)[0].Trim();
        if (!string.Equals(extension, ".csv", StringComparison.OrdinalIgnoreCase) ||
            !(string.Equals(contentType, "text/csv", StringComparison.OrdinalIgnoreCase) ||
              string.Equals(contentType, "application/csv", StringComparison.OrdinalIgnoreCase) ||
              string.Equals(contentType, "application/vnd.ms-excel", StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Unsupported file type",
                Detail = "Upload a .csv file with a CSV content type."
            });
        }

        try
        {
            await using var stream = file.OpenReadStream();
            var summary = await _jobListingImportService.ImportCsvAsync(stream, cancellationToken);
            return Ok(summary);
        }
        catch (JobListingCsvFormatException exception)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid CSV format",
                Detail = exception.Message
            });
        }
    }
}

/// <summary>
/// Multipart form request for importing job listings via CSV.
/// </summary>
public sealed class JobListingImportRequest
{
    /// <summary>CSV file containing job listing records.</summary>
    public IFormFile? File { get; set; }
}

