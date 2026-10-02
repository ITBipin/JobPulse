using System.Net;
using System.Text.Json;
using JobPulse.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace JobPulse.Tests;

public sealed class SwaggerAndEndpointsIntegrationTests
{
    [Fact]
    public async Task SwaggerEndpoints_ReturnOkInDevelopmentEnvironment()
    {
        using var factory = new DevelopmentApiFactory();
        using var client = factory.CreateClient();

        var swaggerJsonResponse = await client.GetAsync("/swagger/v1/swagger.json");
        Assert.Equal(HttpStatusCode.OK, swaggerJsonResponse.StatusCode);

        var json = await swaggerJsonResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.Equal("JobPulse API", root.GetProperty("info").GetProperty("title").GetString());
        Assert.Equal("v1", root.GetProperty("info").GetProperty("version").GetString());

        var paths = root.GetProperty("paths");
        Assert.True(paths.TryGetProperty("/api/v1/dashboard/overview", out _));
        Assert.True(paths.TryGetProperty("/api/v1/dashboard/trends", out _));
        Assert.True(paths.TryGetProperty("/api/v1/dashboard/pressure-ratio", out _));
        Assert.True(paths.TryGetProperty("/api/v1/jobs", out _));
        Assert.True(paths.TryGetProperty("/api/v1/jobs/{id}", out _));
        Assert.True(paths.TryGetProperty("/api/v1/jobs/{id}/freshness", out _));
        Assert.True(paths.TryGetProperty("/api/v1/jobs/import", out _));
        Assert.True(paths.TryGetProperty("/api/v1/job-seekers/active-count", out _));
        Assert.True(paths.TryGetProperty("/api/v1/job-seekers/register", out _));
        Assert.True(paths.TryGetProperty("/api/v1/job-seekers/status", out _));
        Assert.True(paths.TryGetProperty("/api/v1/technologies", out _));
        Assert.True(paths.TryGetProperty("/api/v1/locations", out _));
        Assert.True(paths.TryGetProperty("/api/v1/dashboard/snapshots", out _));

        var swaggerUiResponse = await client.GetAsync("/swagger/index.html");
        Assert.Equal(HttpStatusCode.OK, swaggerUiResponse.StatusCode);
    }

    [Fact]
    public async Task HealthEndpoint_ReturnsOk()
    {
        using var factory = new DevelopmentApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task AllIntendedEndpoints_AreMappedAndRespond()
    {
        using var factory = new DevelopmentApiFactory();
        using var client = factory.CreateClient();

        // 1. GET /api/v1/dashboard/overview
        var overview = await client.GetAsync("/api/v1/dashboard/overview");
        Assert.Equal(HttpStatusCode.OK, overview.StatusCode);

        // 2. GET /api/v1/dashboard/trends
        var trends = await client.GetAsync("/api/v1/dashboard/trends");
        Assert.Equal(HttpStatusCode.OK, trends.StatusCode);

        // 3. GET /api/v1/dashboard/pressure-ratio
        var ratio = await client.GetAsync("/api/v1/dashboard/pressure-ratio");
        Assert.Equal(HttpStatusCode.OK, ratio.StatusCode);

        // 4. GET /api/v1/jobs
        var jobs = await client.GetAsync("/api/v1/jobs");
        Assert.Equal(HttpStatusCode.OK, jobs.StatusCode);

        // 5. GET /api/v1/jobs/{id}
        var jobById = await client.GetAsync($"/api/v1/jobs/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, jobById.StatusCode);

        // 6. GET /api/v1/jobs/{id}/freshness
        var freshness = await client.GetAsync($"/api/v1/jobs/{Guid.NewGuid()}/freshness");
        Assert.Equal(HttpStatusCode.NotFound, freshness.StatusCode);

        // 7. GET /api/v1/job-seekers/active-count
        var activeCount = await client.GetAsync("/api/v1/job-seekers/active-count");
        Assert.Equal(HttpStatusCode.OK, activeCount.StatusCode);

        // 8. GET /api/v1/technologies
        var tech = await client.GetAsync("/api/v1/technologies");
        Assert.Equal(HttpStatusCode.OK, tech.StatusCode);

        // 9. GET /api/v1/locations
        var loc = await client.GetAsync("/api/v1/locations");
        Assert.Equal(HttpStatusCode.OK, loc.StatusCode);

        // 10. POST /api/v1/dashboard/snapshots
        var snapshot = await client.PostAsync("/api/v1/dashboard/snapshots", null);
        Assert.True(snapshot.StatusCode == HttpStatusCode.Created || snapshot.StatusCode == HttpStatusCode.OK);
    }

    private sealed class DevelopmentApiFactory : WebApplicationFactory<Program>
    {
        private readonly string _databaseName = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Development");
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
