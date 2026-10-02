namespace JobPulse.Application.Locations;

public interface ILocationQueryService
{
    Task<IReadOnlyList<LocationDto>> GetLocationsAsync(
        string? citySearch,
        CancellationToken cancellationToken = default);
}