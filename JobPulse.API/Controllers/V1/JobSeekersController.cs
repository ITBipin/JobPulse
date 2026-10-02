using JobPulse.Application.JobSeekers;
using Microsoft.AspNetCore.Mvc;

namespace JobPulse.API.Controllers.V1;

/// <summary>
/// Provides operations for job seeker registration, status updates, and active registered counts.
/// </summary>
[ApiController]
[Route("api/v1/job-seekers")]
public sealed class JobSeekersController : ControllerBase
{
    private readonly IJobSeekerRegistrationService _registrationService;
    private readonly IJobSeekerStatusService _statusService;
    private readonly IActiveJobSeekerCountService _activeJobSeekerCountService;
    private readonly JobSeekerActivityOptions _jobSeekerActivityOptions;
    private readonly TimeProvider _timeProvider;

    public JobSeekersController(
        IJobSeekerRegistrationService registrationService,
        IJobSeekerStatusService statusService,
        IActiveJobSeekerCountService activeJobSeekerCountService,
        JobSeekerActivityOptions jobSeekerActivityOptions,
        TimeProvider timeProvider)
    {
        _registrationService = registrationService;
        _statusService = statusService;
        _activeJobSeekerCountService = activeJobSeekerCountService;
        _jobSeekerActivityOptions = jobSeekerActivityOptions;
        _timeProvider = timeProvider;
    }

    /// <summary>
    /// Registers a voluntary active job seeker on the platform.
    /// </summary>
    /// <remarks>
    /// Creates a registration ('platform_registered') capturing skills, location, experience range, and explicit user consent.
    /// Does not collect unnecessary personal identifiable information.
    /// </remarks>
    /// <param name="request">Job seeker registration information and consent.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="201">Job seeker registration created successfully.</response>
    /// <response code="400">Invalid registration data or unavailable experience/location/technology IDs.</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(JobSeekerRegistrationResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<JobSeekerRegistrationResponse>> Register(
        [FromBody] RegisterJobSeekerRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _registrationService.RegisterAsync(request, cancellationToken);
        if (response is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid registration selections",
                Detail = "One or more selected experience, location, or technology values are unavailable."
            });
        }

        return StatusCode(StatusCodes.Status201Created, response);
    }

    /// <summary>
    /// Updates a job seeker's search status.
    /// </summary>
    /// <remarks>
    /// Updates search status (OpenToWork, NotLooking, Hired) and refreshes confirmation timestamp for activity tracking.
    /// </remarks>
    /// <param name="request">Status update payload containing JobSeekerId and new status.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Status successfully updated.</response>
    /// <response code="400">Invalid or unsupported status value.</response>
    /// <response code="404">Job seeker not found.</response>
    [HttpPut("status")]
    [ProducesResponseType(typeof(JobSeekerStatusUpdateResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<JobSeekerStatusUpdateResponse>> UpdateStatus(
        [FromBody] UpdateJobSeekerStatusRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _statusService.UpdateStatusAsync(request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    /// <summary>
    /// Retrieves the count of voluntary active registered job seekers.
    /// </summary>
    /// <remarks>
    /// Counts verified registered seekers with OpenToWork status, active registration consent, and activity within the confirmation window ('platform_registered').
    /// Does NOT represent the total number of job seekers in India.
    /// </remarks>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Active registered seeker count and methodology metadata.</response>
    [HttpGet("active-count")]
    [ProducesResponseType(typeof(ActiveJobSeekerCountResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ActiveJobSeekerCountResponse>> GetActiveCount(CancellationToken cancellationToken)
    {
        var count = await _activeJobSeekerCountService.GetActiveJobSeekerCountAsync(cancellationToken);
        var response = new ActiveJobSeekerCountResponse(
            count,
            _timeProvider.GetUtcNow(),
            "platform_registered",
            "JobPulse platform registrations",
            $"Counts registered seekers with OpenToWork status, valid registration consent, and confirmation within the last {_jobSeekerActivityOptions.ConfirmationPeriodDays} days.");

        return Ok(response);
    }
}