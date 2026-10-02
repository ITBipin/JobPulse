using JobPulse.Application.Locations;
using Microsoft.AspNetCore.Mvc;

namespace JobPulse.API.Controllers.V1;

/// <summary>
/// Provides operations for querying active locations available on the platform.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public sealed class LocationsController : ControllerBase
{
    private readonly ILocationQueryService _locationQueryService;

    public LocationsController(ILocationQueryService locationQueryService)
    {
        _locationQueryService = locationQueryService;
    }

    /// <summary>
    /// Retrieves active locations for filtering.
    /// </summary>
    /// <remarks>
    /// Returns an ordered list of locations (city, state, country) available on the platform.
    /// </remarks>
    /// <param name="city">Optional search term to filter locations by city name.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">List of available locations.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<LocationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<LocationDto>>> GetLocations(
        [FromQuery] string? city,
        CancellationToken cancellationToken)
    {
        var locations = await _locationQueryService.GetLocationsAsync(city, cancellationToken);
        return Ok(locations);
    }
}