using JobPulse.API.Controllers.V1;
using JobPulse.Application.Jobs;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Jobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JobPulse.Tests;

public sealed class JobDataFreshnessServiceTests
{
    private static readonly DateTimeOffset Now = new(2026, 10, 2, 8, 30, 0, TimeSpan.Zero);

    [Fact]
    public void GetStatus_ClassifiesFreshStaleExpiredAndBoundaries()
    {
        var service = CreateService();
        Assert.Equal(JobFreshnessStatus.Fresh, service.GetStatus(Now, Now));
        Assert.Equal(JobFreshnessStatus.Fresh, service.GetStatus(Now.AddHours(-23), Now));
        Assert.Equal(JobFreshnessStatus.Fresh, service.GetStatus(Now.AddHours(-24).AddMilliseconds(1), Now));
        Assert.Equal(JobFreshnessStatus.Stale, service.GetStatus(Now.AddHours(-24), Now));
        Assert.Equal(JobFreshnessStatus.Stale, service.GetStatus(Now.AddHours(-48), Now));
        Assert.Equal(JobFreshnessStatus.Stale, service.GetStatus(Now.AddHours(-72), Now));
        Assert.Equal(JobFreshnessStatus.Expired, service.GetStatus(Now.AddHours(-72).AddTicks(-1), Now));
        Assert.Equal(JobFreshnessStatus.Expired, service.GetStatus(Now.AddHours(-100), Now));
    }

    [Fact]
    public async Task GetJobFreshnessAsync_ReturnsFreshForRecentlySeenJob()
    {
        var (service, context, _) = CreateServiceWithContext(Now);
        await using (context)
        {
            var job = CreateListing(context, Now.AddHours(-4));

            var result = await service.GetJobFreshnessAsync(job.Id);

            Assert.NotNull(result);
            Assert.Equal(job.Id, result.JobId);
            Assert.Equal(job.LastSeenAt, result.LastSeenAt);
            Assert.Equal(JobFreshnessStatus.Fresh, result.Status);
        }
    }

    [Fact]
    public async Task GetJobFreshnessAsync_ReturnsStaleForJobBetweenFreshAndStaleThresholds()
    {
        var (service, context, _) = CreateServiceWithContext(Now);
        await using (context)
        {
            var job = CreateListing(context, Now.AddHours(-36));

            var result = await service.GetJobFreshnessAsync(job.Id);

            Assert.NotNull(result);
            Assert.Equal(job.Id, result.JobId);
            Assert.Equal(JobFreshnessStatus.Stale, result.Status);
        }
    }

    [Fact]
    public async Task GetJobFreshnessAsync_ReturnsExpiredForOldJob()
    {
        var (service, context, _) = CreateServiceWithContext(Now);
        await using (context)
        {
            var job = CreateListing(context, Now.AddHours(-80));

            var result = await service.GetJobFreshnessAsync(job.Id);

            Assert.NotNull(result);
            Assert.Equal(job.Id, result.JobId);
            Assert.Equal(JobFreshnessStatus.Expired, result.Status);
        }
    }

    [Fact]
    public async Task GetJobFreshnessAsync_ReturnsNullWhenJobDoesNotExist()
    {
        var (service, context, _) = CreateServiceWithContext(Now);
        await using (context)
        {
            var result = await service.GetJobFreshnessAsync(Guid.NewGuid());
            Assert.Null(result);
        }
    }

    [Fact]
    public void AddInfrastructure_UsesConfiguredFreshnessThresholds()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = "Server=(localdb)\\mssqllocaldb;Database=JobPulseTests",
            ["JobDataFreshness:FreshHours"] = "12",
            ["JobDataFreshness:StaleThroughHours"] = "96"
        }).Build();
        var services = new ServiceCollection();
        services.AddInfrastructure(config);
        using var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<JobFreshnessOptions>();
        Assert.Equal(TimeSpan.FromHours(12), options.FreshFor);
        Assert.Equal(TimeSpan.FromHours(96), options.StaleFor);
    }

    [Fact]
    public void AddInfrastructure_UsesDefaultThresholdsWhenConfigOmitted()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = "Server=(localdb)\\mssqllocaldb;Database=JobPulseTests"
        }).Build();
        var services = new ServiceCollection();
        services.AddInfrastructure(config);
        using var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<JobFreshnessOptions>();
        Assert.Equal(TimeSpan.FromHours(24), options.FreshFor);
        Assert.Equal(TimeSpan.FromHours(72), options.StaleFor);
    }

    [Fact]
    public void AddInfrastructure_ThrowsWhenStaleThresholdDoesNotExceedFresh()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = "Server=(localdb)\\mssqllocaldb;Database=JobPulseTests",
            ["JobDataFreshness:FreshHours"] = "48",
            ["JobDataFreshness:StaleThroughHours"] = "24"
        }).Build();
        var services = new ServiceCollection();
        Assert.Throws<InvalidOperationException>(() => services.AddInfrastructure(config));
    }

    [Fact]
    public async Task JobsController_GetFreshness_ReturnsOkWithStatus()
    {
        var (service, context, _) = CreateServiceWithContext(Now);
        await using (context)
        {
            var job = CreateListing(context, Now.AddHours(-1));
            var controller = new JobsController(
                new JobListService(context),
                new JobListingImportService(context),
                service);

            var actionResult = await controller.GetFreshness(job.Id, CancellationToken.None);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dto = Assert.IsType<JobFreshnessDto>(okResult.Value);

            Assert.Equal(job.Id, dto.JobId);
            Assert.Equal(JobFreshnessStatus.Fresh, dto.Status);
            Assert.Equal(job.LastSeenAt, dto.LastSeenAt);
        }
    }

    [Fact]
    public async Task JobsController_GetFreshness_ReturnsNotFoundForUnknownJob()
    {
        var (service, context, _) = CreateServiceWithContext(Now);
        await using (context)
        {
            var controller = new JobsController(
                new JobListService(context),
                new JobListingImportService(context),
                service);

            var actionResult = await controller.GetFreshness(Guid.NewGuid(), CancellationToken.None);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }
    }

    private static JobDataFreshnessService CreateService()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        var context = new JobPulseDbContext(options);
        return new JobDataFreshnessService(context, new JobFreshnessOptions(TimeSpan.FromHours(24), TimeSpan.FromHours(72)), TimeProvider.System);
    }

    private static (JobDataFreshnessService Service, JobPulseDbContext Context, FixedTimeProvider TimeProvider) CreateServiceWithContext(DateTimeOffset now)
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        var context = new JobPulseDbContext(options);
        var timeProvider = new FixedTimeProvider(now);
        var service = new JobDataFreshnessService(context, new JobFreshnessOptions(TimeSpan.FromHours(24), TimeSpan.FromHours(72)), timeProvider);
        return (service, context, timeProvider);
    }

    private static JobListing CreateListing(JobPulseDbContext context, DateTimeOffset lastSeenAt)
    {
        var tech = new Technology { Name = "C#" };
        var loc = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var exp = new ExperienceRange { MinimumYears = 2, MaximumYears = 5, Label = "2-5 years" };
        var src = new JobListingSource { Name = "Feed" };
        var job = new JobListing
        {
            Title = "Backend Dev",
            CompanyName = "TechCorp",
            LastSeenAt = lastSeenAt,
            CollectedAtUtc = lastSeenAt.UtcDateTime,
            Technology = tech,
            Location = loc,
            ExperienceRange = exp,
            JobListingSource = src
        };
        context.AddRange(tech, loc, exp, src, job);
        context.SaveChanges();
        return job;
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
