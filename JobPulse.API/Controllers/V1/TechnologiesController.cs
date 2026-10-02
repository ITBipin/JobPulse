using JobPulse.Application.Technologies;
using Microsoft.AspNetCore.Mvc;

namespace JobPulse.API.Controllers.V1;

/// <summary>
/// Provides operations for querying active technologies tracked on the platform.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public sealed class TechnologiesController : ControllerBase
{
    private readonly ITechnologyQueryService _technologyQueryService;

    public TechnologiesController(ITechnologyQueryService technologyQueryService)
    {
        _technologyQueryService = technologyQueryService;
    }

    /// <summary>
    /// Retrieves active technologies for filtering.
    /// </summary>
    /// <remarks>
    /// Returns an alphabetically ordered list of active technologies tracked on the platform.
    /// </remarks>
    /// <param name="search">Optional text to filter technologies by name.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">List of active technologies.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TechnologyDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TechnologyDto>>> GetTechnologies(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var technologies = await _technologyQueryService.GetTechnologiesAsync(search, cancellationToken);
        return Ok(technologies);
    }
}