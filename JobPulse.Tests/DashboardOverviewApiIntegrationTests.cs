using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text;
using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace JobPulse.Tests;

public class DashboardOverviewApiIntegrationTests
{
    [Fact]
    public async Task GetOverview_ReturnsDatabaseBackedDashboardCalculations()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        var now = new DateTime(DateTime.UtcNow.Ticks - (DateTime.UtcNow.Ticks % TimeSpan.TicksPerSecond), DateTimeKind.Utc);

        await SeedDashboardDataAsync(factory.Services, now);

        var response = await client.GetAsync("/api/v1/dashboard/overview");
        var overview = await response.Content.ReadFromJsonAsync<DashboardOverviewResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(overview);
        Assert.Equal("platform_tracked", overview.DataSource);
        Assert.Equal("platform_overview", overview.DataType);

        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("platform_tracked", json.RootElement.GetProperty("dataSource").GetString());
        Assert.Equal("platform_overview", json.RootElement.GetProperty("dataType").GetString());

        Assert.Equal(1, overview.ActiveRegisteredJobSeekers);
        Assert.Equal(3, overview.ActiveTrackedJobListings);
        Assert.Equal(2, overview.NewListingsLast7Days);
        Assert.Equal(4, overview.NewListingsLast30Days);
        Assert.Equal(now.AddDays(-1), overview.LastDataUpdate);
        Assert.Collection(
            overview.TopTechnologies,
            item =>
            {
                Assert.Equal("C#", item.TechnologyName);
                Assert.Equal(2, item.JobCount);
            },
            item =>
            {
                Assert.Equal("Python", item.TechnologyName);
                Assert.Equal(1, item.JobCount);
            });
        Assert.Collection(
            overview.TopLocations,
            item =>
            {
                Assert.Equal("Bengaluru", item.City);
                Assert.Equal("Karnataka", item.State);
                Assert.Equal(2, item.JobCount);
            },
            item =>
            {
                Assert.Equal("Pune", item.City);
                Assert.Equal("Maharashtra", item.State);
                Assert.Equal(1, item.JobCount);
            });
    }

    [Fact]
    public async Task GetOverview_ReturnsZeroCountsAndNoLastUpdateWhenDatabaseIsEmpty()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/dashboard/overview");
        var overview = await response.Content.ReadFromJsonAsync<DashboardOverviewResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(overview);
        Assert.Equal("platform_tracked", overview.DataSource);
        Assert.Equal(0, overview.ActiveRegisteredJobSeekers);
        Assert.Equal(0, overview.ActiveTrackedJobListings);
        Assert.Equal(0, overview.NewListingsLast7Days);
        Assert.Equal(0, overview.NewListingsLast30Days);
        Assert.Empty(overview.TopTechnologies);
        Assert.Empty(overview.TopLocations);
        Assert.Null(overview.LastDataUpdate);
    }

    [Fact]
    public async Task GetTrends_ReturnsEmptyCollectionAndSnapshotMetadataWhenNoSnapshotsExist()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/dashboard/trends?from=2026-09-03&to=2026-10-02");
        var trends = await response.Content.ReadFromJsonAsync<DashboardTrendsResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(trends);
        Assert.Equal(new DateOnly(2026, 9, 3), trends.From);
        Assert.Equal(new DateOnly(2026, 10, 2), trends.To);
        Assert.Equal("platform_snapshots", trends.DataSource);
        Assert.Equal("historical_snapshot", trends.DataType);
        Assert.Null(trends.LastUpdated);
        Assert.Empty(trends.Data);

        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal(
            new[] { "from", "to", "dataSource", "dataType", "lastUpdated", "data" },
            json.RootElement.EnumerateObject().Select(property => property.Name));
        Assert.Equal("2026-09-03", json.RootElement.GetProperty("from").GetString());
        Assert.Equal("2026-10-02", json.RootElement.GetProperty("to").GetString());
        Assert.Equal(JsonValueKind.Null, json.RootElement.GetProperty("lastUpdated").ValueKind);
        Assert.Equal(JsonValueKind.Array, json.RootElement.GetProperty("data").ValueKind);
    }

    [Fact]
    public async Task GetTrends_UsesCurrentUtcThirtyDayBoundsWhenEmptyAndDatesAreOmitted()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        var todayUtc = DateOnly.FromDateTime(DateTime.UtcNow);

        var response = await client.GetAsync("/api/v1/dashboard/trends");
        var trends = await response.Content.ReadFromJsonAsync<DashboardTrendsResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(trends);
        Assert.Equal(todayUtc.AddDays(-29), trends.From);
        Assert.Equal(todayUtc, trends.To);
        Assert.Null(trends.LastUpdated);
        Assert.Empty(trends.Data);
    }

    [Fact]
    public async Task GetTrends_ReturnsOneStoredSnapshot()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        var snapshot = CreateSnapshot(new DateOnly(2026, 10, 1), 12, 4, 3, 8);
        await SeedSnapshotsAsync(factory.Services, snapshot);

        var response = await client.GetAsync("/api/v1/dashboard/trends");
        var trends = await response.Content.ReadFromJsonAsync<DashboardTrendsResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(trends);
        Assert.Equal(new DateOnly(2026, 10, 1), trends.From);
        Assert.Equal(new DateOnly(2026, 10, 1), trends.To);
        Assert.Equal(snapshot.CreatedAt, trends.LastUpdated?.UtcDateTime);
        var point = Assert.Single(trends.Data);
        Assert.Equal(snapshot.SnapshotDate, point.SnapshotDate);
        Assert.Equal(12, point.ActiveTrackedJobs);
        Assert.Equal(4, point.ActiveRegisteredJobSeekers);
        Assert.Equal(3, point.NewJobsLast7Days);
        Assert.Equal(8, point.NewJobsLast30Days);
    }

    [Fact]
    public async Task GetTrends_ReturnsMultipleStoredSnapshotsInDateOrderWithoutFillingGaps()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        await SeedSnapshotsAsync(
            factory.Services,
            CreateSnapshot(new DateOnly(2026, 9, 30), 30, 8, 5, 12),
            CreateSnapshot(new DateOnly(2026, 9, 25), 25, 7, 4, 10),
            CreateSnapshot(new DateOnly(2026, 9, 27), 27, 6, 3, 9));

        var response = await client.GetAsync("/api/v1/dashboard/trends");
        var trends = await response.Content.ReadFromJsonAsync<DashboardTrendsResponse>();

        Assert.NotNull(trends);
        Assert.Collection(
            trends.Data,
            point => Assert.Equal(new DateOnly(2026, 9, 25), point.SnapshotDate),
            point => Assert.Equal(new DateOnly(2026, 9, 27), point.SnapshotDate),
            point => Assert.Equal(new DateOnly(2026, 9, 30), point.SnapshotDate));
    }

    [Fact]
    public async Task GetTrends_FiltersStoredSnapshotsByInclusiveDateRange()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        await SeedSnapshotsAsync(
            factory.Services,
            CreateSnapshot(new DateOnly(2026, 9, 27), 27, 6, 3, 9),
            CreateSnapshot(new DateOnly(2026, 9, 28), 28, 6, 3, 9),
            CreateSnapshot(new DateOnly(2026, 9, 30), 30, 8, 5, 12),
            CreateSnapshot(new DateOnly(2026, 10, 1), 31, 8, 5, 12));

        var response = await client.GetAsync("/api/v1/dashboard/trends?from=2026-09-28&to=2026-09-30");
        var trends = await response.Content.ReadFromJsonAsync<DashboardTrendsResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(trends);
        Assert.Equal(new DateOnly(2026, 9, 28), trends.From);
        Assert.Equal(new DateOnly(2026, 9, 30), trends.To);
        Assert.Collection(
            trends.Data,
            point => Assert.Equal(new DateOnly(2026, 9, 28), point.SnapshotDate),
            point => Assert.Equal(new DateOnly(2026, 9, 30), point.SnapshotDate));
    }

    [Fact]
    public async Task GetTrends_ReturnsBadRequestForReversedDateRange()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/dashboard/trends?from=2026-02-01&to=2026-01-01");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTrends_ReturnsBadRequestForInvalidDateFormat()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/dashboard/trends?from=invalid&to=2026-10-02");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateSnapshot_ReturnsCreatedThenExistingSnapshotWithoutDuplicates()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();

        var firstResponse = await client.PostAsync("/api/v1/dashboard/snapshots", content: null);
        var firstSnapshot = await firstResponse.Content.ReadFromJsonAsync<MarketSnapshotDto>();
        var repeatedResponse = await client.PostAsync("/api/v1/dashboard/snapshots", content: null);
        var repeatedSnapshot = await repeatedResponse.Content.ReadFromJsonAsync<MarketSnapshotDto>();

        Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);
        Assert.Equal(HttpStatusCode.OK, repeatedResponse.StatusCode);
        Assert.NotNull(firstSnapshot);
        Assert.NotNull(repeatedSnapshot);
        Assert.Equal(firstSnapshot.Id, repeatedSnapshot.Id);

        using var scope = factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<JobPulseDbContext>();
        Assert.Equal(1, await context.MarketSnapshots.CountAsync());
        Assert.Equal(0, firstSnapshot.ActiveTrackedJobs);
        Assert.Equal(0, firstSnapshot.ActiveRegisteredJobSeekers);
    }

    [Fact]
    public async Task ImportJobs_AcceptsMultipartCsvAndReturnsImportSummary()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        using (var scope = factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<JobPulseDbContext>();
            await context.Database.EnsureCreatedAsync();
            context.AddRange(
                new Technology { Name = "C#" },
                new Location { City = "Bengaluru", State = "Karnataka", Country = "India" },
                new ExperienceRange { MinimumYears = 2, MaximumYears = 5, Label = "2-5 years" },
                new JobListingSource { Name = "TrustedFeed" });
            await context.SaveChangesAsync();
        }

        using var multipart = new MultipartFormDataContent();
        var csvFile = new ByteArrayContent(Encoding.UTF8.GetBytes(
            "Title,CompanyName,Technology,Location,ExperienceRange,Source,SourceJobId,PostedDate\n" +
            "Software Engineer,Example Corp,C#,Bengaluru,2-5 years,TrustedFeed,api-job-1,2026-09-15"));
        csvFile.Headers.ContentType = new MediaTypeHeaderValue("text/csv");
        multipart.Add(csvFile, "file", "jobs.csv");

        var response = await client.PostAsync("/api/v1/jobs/import", multipart);
        var summary = await response.Content.ReadFromJsonAsync<JobListingImportSummary>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(summary);
        Assert.Equal(1, summary.TotalRows);
        Assert.Equal(1, summary.ImportedRows);
        Assert.Equal(0, summary.SkippedRows);
        Assert.Equal(0, summary.DuplicateRows);
        Assert.Equal(0, summary.InvalidRows);
        Assert.NotNull(summary.ImportBatchId);

        using (var scope = factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<JobPulseDbContext>();
            var batch = await context.JobImportBatches.SingleOrDefaultAsync(b => b.Id == summary.ImportBatchId);
            Assert.NotNull(batch);
            Assert.Equal("Completed", batch.Status);
            Assert.Equal(1, batch.ImportedRows);
            Assert.Equal(1, batch.TotalRows);
        }
    }

    [Fact]
    public async Task GetPressureRatio_WithValidRequestAndFilters_ReturnsHttp200AndCalculatedRatio()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        var now = DateTime.UtcNow;

        var seeded = await SeedPressureRatioDataAsync(factory.Services, now);

        var url = $"/api/v1/dashboard/pressure-ratio?technologyId={seeded.TechnologyId}&locationId={seeded.LocationId}&experienceRangeId={seeded.ExperienceRangeId}";
        var response = await client.GetAsync(url);
        var result = await response.Content.ReadFromJsonAsync<JobMarketPressureRatioResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(result);
        Assert.True(result.IsAvailable);
        Assert.Equal(1.5m, result.Ratio);
        Assert.Equal(3, result.SampleSize.ActiveRegisteredJobSeekers);
        Assert.Equal(2, result.SampleSize.ActiveTrackedJobListings);
        Assert.Equal(seeded.TechnologyId, result.Filters.TechnologyId);
        Assert.Equal(seeded.LocationId, result.Filters.LocationId);
        Assert.Equal(seeded.ExperienceRangeId, result.Filters.ExperienceRangeId);
        Assert.Equal("platform_specific", result.Metadata.Scope);
        Assert.Null(result.Metadata.UnavailableReason);
    }

    [Fact]
    public async Task GetPressureRatio_WhenZeroActiveTrackedJobs_ReturnsHttp200WithUnavailableRatio()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/dashboard/pressure-ratio");
        var result = await response.Content.ReadFromJsonAsync<JobMarketPressureRatioResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(result);
        Assert.False(result.IsAvailable);
        Assert.Null(result.Ratio);
        Assert.Equal(0, result.SampleSize.ActiveTrackedJobListings);
        Assert.Equal(0, result.SampleSize.ActiveRegisteredJobSeekers);
        Assert.Equal("No active tracked job listings matched the selected filters.", result.Metadata.UnavailableReason);
    }

    [Fact]
    public async Task GetPressureRatio_WhenFiltersMatchZeroActiveJobs_ReturnsHttp200WithPassedFiltersAndUnavailableRatio()
    {
        using var factory = new DashboardApiFactory();
        using var client = factory.CreateClient();
        var now = DateTime.UtcNow;

        var seeded = await SeedPressureRatioDataAsync(factory.Services, now);
        var unusedLocationId = Guid.NewGuid();

        var url = $"/api/v1/dashboard/pressure-ratio?technologyId={seeded.TechnologyId}&locationId={unusedLocationId}&experienceRangeId={seeded.ExperienceRangeId}";
        var response = await client.GetAsync(url);
        var result = await response.Content.ReadFromJsonAsync<JobMarketPressureRatioResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(result);
        Assert.False(result.IsAvailable);
        Assert.Null(result.Ratio);
        Assert.Equal(0, result.SampleSize.ActiveTrackedJobListings);
        Assert.Equal(seeded.TechnologyId, result.Filters.TechnologyId);
        Assert.Equal(unusedLocationId, result.Filters.LocationId);
        Assert.Equal(seeded.ExperienceRangeId, result.Filters.ExperienceRangeId);
        Assert.Equal("No active tracked job listings matched the selected filters.", result.Metadata.UnavailableReason);
    }

    private static async Task SeedDashboardDataAsync(IServiceProvider services, DateTime now)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<JobPulseDbContext>();
        await context.Database.EnsureCreatedAsync();

        var csharp = new Technology { Name = "C#" };
        var python = new Technology { Name = "Python" };
        var bengaluru = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var pune = new Location { City = "Pune", State = "Maharashtra", Country = "India" };
        var experience = new ExperienceRange { MinimumYears = 2, MaximumYears = 5, Label = "2-5 years" };
        var source = new JobListingSource { Name = "TestSource" };

        context.JobListings.AddRange(
            CreateListing(csharp, bengaluru, experience, source, now.AddDays(-2), isActive: true),
            CreateListing(csharp, bengaluru, experience, source, now.AddDays(-9), isActive: true),
            CreateListing(python, pune, experience, source, now.AddDays(-20), isActive: true),
            CreateListing(python, pune, experience, source, now.AddDays(-1), isActive: false));

        context.JobSeekers.Add(new JobSeeker
        {
            Source = "PublicRegistration",
            DataQualityStatus = "SelfReported",
            IsActive = true,
            JobSearchStatus = JobSeekerStatuses.OpenToWork,
            LastConfirmedAt = now,
            CollectedAtUtc = now.AddDays(-3),
            ExperienceRange = experience,
            Location = bengaluru,
            Consents =
            [
                new UserConsent
                {
                    ConsentType = "JobSeekerRegistration",
                    IsGranted = true,
                    GrantedAtUtc = now.AddDays(-3),
                    DataQualityStatus = "SelfReported"
                }
            ]
        });

        await context.SaveChangesAsync();
    }

    private static async Task SeedSnapshotsAsync(IServiceProvider services, params MarketSnapshot[] snapshots)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<JobPulseDbContext>();
        await context.Database.EnsureCreatedAsync();
        context.MarketSnapshots.AddRange(snapshots);
        await context.SaveChangesAsync();
    }

    private static MarketSnapshot CreateSnapshot(
        DateOnly date,
        int activeJobs,
        int activeSeekers,
        int newJobsLast7Days,
        int newJobsLast30Days) => new()
    {
        SnapshotDate = date,
        ActiveTrackedJobs = activeJobs,
        ActiveRegisteredJobSeekers = activeSeekers,
        NewJobsLast7Days = newJobsLast7Days,
        NewJobsLast30Days = newJobsLast30Days,
        CreatedAt = date.ToDateTime(new TimeOnly(12, 0), DateTimeKind.Utc)
    };

    private static JobListing CreateListing(
        Technology technology,
        Location location,
        ExperienceRange experience,
        JobListingSource source,
        DateTime collectedAtUtc,
        bool isActive) => new()
    {
        Title = "Engineer",
        CompanyName = "Example",
        IsActive = isActive,
        CollectedAtUtc = collectedAtUtc,
        Technology = technology,
        Location = location,
        ExperienceRange = experience,
        JobListingSource = source
    };

    private static async Task<(Guid TechnologyId, Guid LocationId, Guid ExperienceRangeId)> SeedPressureRatioDataAsync(
        IServiceProvider services,
        DateTime now)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<JobPulseDbContext>();
        await context.Database.EnsureCreatedAsync();

        var csharp = new Technology { Name = "C#" };
        var python = new Technology { Name = "Python" };
        var bengaluru = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" };
        var pune = new Location { City = "Pune", State = "Maharashtra", Country = "India" };
        var junior = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = "1-3 years" };
        var senior = new ExperienceRange { MinimumYears = 4, MaximumYears = 8, Label = "4-8 years" };
        var source = new JobListingSource { Name = "TestSource" };

        context.JobListings.AddRange(
            CreateListing(csharp, bengaluru, junior, source, now.AddDays(-2), isActive: true),
            CreateListing(csharp, bengaluru, junior, source, now.AddDays(-5), isActive: true),
            CreateListing(python, pune, senior, source, now.AddDays(-10), isActive: true),
            CreateListing(csharp, bengaluru, junior, source, now.AddDays(-1), isActive: false));

        context.JobSeekers.AddRange(
            CreatePressureRatioSeeker(csharp, bengaluru, junior, now),
            CreatePressureRatioSeeker(csharp, bengaluru, junior, now),
            CreatePressureRatioSeeker(csharp, bengaluru, junior, now),
            CreatePressureRatioSeeker(python, pune, senior, now));

        await context.SaveChangesAsync();
        return (csharp.Id, bengaluru.Id, junior.Id);
    }

    private static JobSeeker CreatePressureRatioSeeker(
        Technology technology,
        Location location,
        ExperienceRange experienceRange,
        DateTime now) => new()
    {
        Source = "PublicRegistration",
        DataQualityStatus = "SelfReported",
        IsActive = true,
        JobSearchStatus = JobSeekerStatuses.OpenToWork,
        LastConfirmedAt = now,
        CollectedAtUtc = now,
        ExperienceRange = experienceRange,
        Location = location,
        Skills = [new JobSeekerSkill { Technology = technology, TechnologyId = technology.Id }],
        Consents =
        [
            new UserConsent
            {
                ConsentType = "JobSeekerRegistration",
                IsGranted = true,
                GrantedAtUtc = now,
                DataQualityStatus = "SelfReported"
            }
        ]
    };

    private sealed class DashboardApiFactory : WebApplicationFactory<Program>
    {
        private readonly string _databaseName = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureAppConfiguration((_, configuration) =>
                configuration.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ConnectionStrings:DefaultConnection"] = "Server=(local);Database=JobPulseTests;Trusted_Connection=True;"
                }));
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<DbContextOptions<JobPulseDbContext>>();
                services.RemoveAll<DbContextOptions>();
                services.RemoveAll<JobPulseDbContext>();
                services.AddSingleton<DbContextOptions<JobPulseDbContext>>(_ =>
                    new DbContextOptionsBuilder<JobPulseDbContext>()
                        .UseInMemoryDatabase(_databaseName)
                        .Options);
                services.AddScoped<JobPulseDbContext>();
            });
        }
    }
}