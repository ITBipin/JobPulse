using JobPulse.Application.Jobs;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Jobs;

public sealed class ActiveJobListingsByTechnologyService : IActiveJobListingsByTechnologyService
{
    private readonly JobPulseDbContext _dbContext;

    public ActiveJobListingsByTechnologyService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<TechnologyJobCount>> GetActiveJobCountsByTechnologyAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.JobListings
            .AsNoTracking()
            .Where(listing => listing.IsActive)
            .GroupBy(listing => new { listing.TechnologyId, listing.Technology.Name })
            .OrderBy(group => group.Key.Name)
            .Select(group => new TechnologyJobCount(
                group.Key.TechnologyId,
                group.Key.Name,
                group.Count()))
            .ToListAsync(cancellationToken);
    }
}