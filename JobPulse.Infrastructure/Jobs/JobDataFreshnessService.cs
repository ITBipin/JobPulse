using JobPulse.Application.Jobs;
using JobPulse.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Jobs;

public sealed class JobDataFreshnessService : IJobDataFreshnessService
{
    private readonly JobPulseDbContext _dbContext;
    private readonly JobFreshnessOptions _options;
    private readonly TimeProvider _timeProvider;

    public JobDataFreshnessService(JobPulseDbContext dbContext, JobFreshnessOptions options, TimeProvider timeProvider)
    {
        _dbContext = dbContext;
        _options = options;
        _timeProvider = timeProvider;
    }

    public JobFreshnessStatus GetStatus(DateTimeOffset lastSeenAt, DateTimeOffset now)
    {
        var age = now - lastSeenAt;
        if (age < _options.FreshFor) return JobFreshnessStatus.Fresh;
        if (age <= _options.StaleFor) return JobFreshnessStatus.Stale;
        return JobFreshnessStatus.Expired;
    }

    public async Task<JobFreshnessDto?> GetJobFreshnessAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        var job = await _dbContext.JobListings.AsNoTracking()
            .Where(job => job.Id == jobId)
            .Select(job => new { job.LastSeenAt })
            .FirstOrDefaultAsync(cancellationToken);

        if (job is null)
        {
            return null;
        }

        return new JobFreshnessDto(jobId, job.LastSeenAt, GetStatus(job.LastSeenAt, _timeProvider.GetUtcNow()));
    }
}
