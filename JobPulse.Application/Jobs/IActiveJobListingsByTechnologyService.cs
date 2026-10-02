namespace JobPulse.Application.Jobs;

public interface IActiveJobListingsByTechnologyService
{
    Task<IReadOnlyList<TechnologyJobCount>> GetActiveJobCountsByTechnologyAsync(
        CancellationToken cancellationToken = default);
}