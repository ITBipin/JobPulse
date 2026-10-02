using JobPulse.Application.Technologies;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Technologies;

public sealed class TechnologyQueryService : ITechnologyQueryService
{
    private readonly JobPulseDbContext _dbContext;

    public TechnologyQueryService(JobPulseDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<TechnologyDto>> GetTechnologiesAsync(
        string? search,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Technologies.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim().ToLower();
            query = query.Where(technology => technology.Name.ToLower().Contains(searchTerm));
        }

        return await query
            .OrderBy(technology => technology.Name)
            .Select(technology => new TechnologyDto(technology.Id, technology.Name, technology.IsActive))
            .ToListAsync(cancellationToken);
    }
}