using System.Text.Json.Serialization;

namespace JobPulse.Application.Jobs;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum JobFreshnessStatus
{
    Fresh,
    Stale,
    Expired
}

public sealed record JobFreshnessOptions(TimeSpan FreshFor, TimeSpan StaleFor);

public sealed record JobFreshnessDto(Guid JobId, DateTimeOffset LastSeenAt, JobFreshnessStatus Status);

public interface IJobDataFreshnessService
{
    JobFreshnessStatus GetStatus(DateTimeOffset lastSeenAt, DateTimeOffset now);
    Task<JobFreshnessDto?> GetJobFreshnessAsync(Guid jobId, CancellationToken cancellationToken = default);
}
