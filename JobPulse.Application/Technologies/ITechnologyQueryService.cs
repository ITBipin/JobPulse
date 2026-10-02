namespace JobPulse.Application.Technologies;

public interface ITechnologyQueryService
{
    Task<IReadOnlyList<TechnologyDto>> GetTechnologiesAsync(
        string? search,
        CancellationToken cancellationToken = default);
}