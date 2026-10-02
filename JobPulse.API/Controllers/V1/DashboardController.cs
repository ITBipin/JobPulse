using JobPulse.Application.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace JobPulse.API.Controllers.V1;

/// <summary>
/// Provides dashboard metrics, historical trends, snapshots, and market pressure ratios.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public sealed class DashboardController : ControllerBase
{
    private readonly IDashboardOverviewService _dashboardOverviewService;
    private readonly IDashboardTrendsService _dashboardTrendsService;
    private readonly IMarketSnapshotService _marketSnapshotService;
    private readonly IJobMarketPressureRatioService _pressureRatioService;

    public DashboardController(
        IDashboardOverviewService dashboardOverviewService,
        IDashboardTrendsService dashboardTrendsService,
        IMarketSnapshotService marketSnapshotService,
        IJobMarketPressureRatioService pressureRatioService)
    {
        _dashboardOverviewService = dashboardOverviewService;
        _dashboardTrendsService = dashboardTrendsService;
        _marketSnapshotService = marketSnapshotService;
        _pressureRatioService = pressureRatioService;
    }

    /// <summary>
    /// Retrieves dashboard overview metrics.
    /// </summary>
    /// <remarks>
    /// Returns high-level metrics including active registered job seekers ('platform_registered'),
    /// active tracked job listings ('platform_tracked'), new listings (7 and 30 days), and top technologies and locations.
    /// Does NOT represent total job seekers or all jobs across India.
    /// </remarks>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Overview metrics successfully retrieved.</response>
    [HttpGet("overview")]
    [ProducesResponseType(typeof(DashboardOverviewResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardOverviewResponse>> GetOverview(CancellationToken cancellationToken)
    {
        var overview = await _dashboardOverviewService.GetOverviewAsync(cancellationToken);
        return Ok(overview);
    }

    /// <summary>
    /// Retrieves historical dashboard snapshots for trend analysis.
    /// </summary>
    /// <remarks>
    /// Returns historical daily snapshots ('platform_snapshots') within the requested date range.
    /// If omitted, defaults to the last 30 days.
    /// </remarks>
    /// <param name="query">Date range filters ('from' and 'to' in YYYY-MM-DD format).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Historical trend snapshots successfully retrieved.</response>
    /// <response code="400">Invalid date range format or reversed date interval.</response>
    [HttpGet("trends")]
    [ProducesResponseType(typeof(DashboardTrendsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DashboardTrendsResponse>> GetTrends(
        [FromQuery] DashboardTrendsQuery query,
        CancellationToken cancellationToken)
    {
        var trends = await _dashboardTrendsService.GetTrendsAsync(query, cancellationToken);
        return Ok(trends);
    }

    /// <summary>
    /// Calculates the job-market pressure ratio for selected filters.
    /// </summary>
    /// <remarks>
    /// Calculates the ratio of active registered job seekers ('platform_registered') to active tracked job listings ('platform_tracked')
    /// for optional technology, location, and experience filters. If no active tracked jobs exist, the ratio is reported as unavailable.
    /// </remarks>
    /// <param name="query">Optional filters (TechnologyId, LocationId, ExperienceRangeId).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Calculated pressure ratio and sample size metadata.</response>
    /// <response code="400">Invalid filter identifier format.</response>
    [HttpGet("pressure-ratio")]
    [ProducesResponseType(typeof(JobMarketPressureRatioResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<JobMarketPressureRatioResponse>> GetPressureRatio(
        [FromQuery] JobMarketPressureRatioQuery? query,
        CancellationToken cancellationToken)
    {
        var response = await _pressureRatioService.CalculateAsync(query ?? new JobMarketPressureRatioQuery(), cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Captures and persists today's platform market snapshot.
    /// </summary>
    /// <remarks>
    /// Records daily counts of active tracked jobs ('platform_tracked') and active registered job seekers ('platform_registered') for historical trends ('platform_snapshots').
    /// </remarks>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Today's snapshot already existed and was returned.</response>
    /// <response code="201">Today's snapshot was newly created and persisted.</response>
    [HttpPost("snapshots")]
    [ProducesResponseType(typeof(MarketSnapshotDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(MarketSnapshotDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MarketSnapshotDto>> CreateTodaysSnapshot(CancellationToken cancellationToken)
    {
        var result = await _marketSnapshotService.CreateTodaysSnapshotAsync(cancellationToken);
        return result.WasCreated
            ? StatusCode(StatusCodes.Status201Created, result.Snapshot)
            : Ok(result.Snapshot);
    }
}
