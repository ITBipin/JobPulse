using JobPulse.Application.Jobs;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Jobs;

public sealed class ActiveJobListingsByCityService : IActiveJobListingsByCityService
{
    private readonly JobPulseDbContext _dbContext;

    public ActiveJobListingsByCityService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CityJobCount>> GetActiveJobCountsByCityAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.JobListings
            .AsNoTracking()
            .Where(listing => listing.IsActive)
            .GroupBy(listing => new
            {
                listing.LocationId,
                listing.Location.City,
                listing.Location.State
            })
            .OrderBy(group => group.Key.City)
            .ThenBy(group => group.Key.State)
            .Select(group => new CityJobCount(
                group.Key.LocationId,
                group.Key.City,
                group.Key.State,
                group.Count()))
            .ToListAsync(cancellationToken);
    }
}