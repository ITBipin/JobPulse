namespace JobPulse.Application.Jobs;

public interface IActiveJobListingsByCityService
{
    Task<IReadOnlyList<CityJobCount>> GetActiveJobCountsByCityAsync(
        CancellationToken cancellationToken = default);
}