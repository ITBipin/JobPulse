using JobPulse.Application.Locations;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Locations;

public sealed class LocationQueryService : ILocationQueryService
{
    private readonly JobPulseDbContext _dbContext;

    public LocationQueryService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<LocationDto>> GetLocationsAsync(
        string? citySearch,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Locations.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(citySearch))
        {
            var searchTerm = citySearch.Trim().ToLower();
            query = query.Where(location => location.City.ToLower().Contains(searchTerm));
        }

        return await query
            .OrderBy(location => location.City)
            .Select(location => new LocationDto(location.Id, location.City, location.State, location.Country))
            .ToListAsync(cancellationToken);
    }
}