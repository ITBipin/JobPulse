using JobPulse.API.Controllers.V1;
using JobPulse.Application.JobSeekers;
using Microsoft.AspNetCore.Mvc;

namespace JobPulse.Tests;

public class ActiveJobSeekerCountApiTests
{
    [Fact]
    public async Task GetActiveCount_ReturnsCountAndPlatformMethodologyMetadata()
    {
        var now = new DateTimeOffset(2026, 10, 2, 12, 0, 0, TimeSpan.Zero);
        var controller = new JobSeekersController(
            new NoopRegistrationService(),
            new NoopStatusService(),
            new StubActiveCountService(27),
            new JobSeekerActivityOptions(45),
            new FixedTimeProvider(now));

        var action = await controller.GetActiveCount(CancellationToken.None);
        var response = Assert.IsType<ActiveJobSeekerCountResponse>(Assert.IsType<OkObjectResult>(action.Result).Value);

        Assert.Equal(27, response.Count);
        Assert.Equal(now, response.LastUpdated);
        Assert.Equal("platform_registered", response.DataSource);
        Assert.Equal("platform_registered", response.DataType);
        Assert.Equal("JobPulse platform registrations", response.Source);
        Assert.Contains("OpenToWork", response.Methodology);
        Assert.Contains("45 days", response.Methodology);
    }

    private sealed class StubActiveCountService : IActiveJobSeekerCountService
    {
        private readonly int _count;

        public StubActiveCountService(int count)
        {
            _count = count;
        }

        public Task<int> GetActiveJobSeekerCountAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(_count);

        public Task<int> GetActiveJobSeekerCountAsync(
            ActiveJobSeekerCountFilter filter,
            CancellationToken cancellationToken = default) =>
            Task.FromResult(_count);
    }

    private sealed class NoopRegistrationService : IJobSeekerRegistrationService
    {
        public Task<JobSeekerRegistrationResponse?> RegisterAsync(
            RegisterJobSeekerRequest request,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();
    }

    private sealed class NoopStatusService : IJobSeekerStatusService
    {
        public Task<JobSeekerStatusUpdateResponse?> UpdateStatusAsync(
            UpdateJobSeekerStatusRequest request,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();
    }

    private sealed class FixedTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _now;

        public FixedTimeProvider(DateTimeOffset now)
        {
            _now = now;
        }

        public override DateTimeOffset GetUtcNow() => _now;
    }
}