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

public class SwaggerOpenApiDocumentationTests
{
    [Fact]
    public async Task SwaggerDocument_IsGeneratedSuccessfullyWithAllRequiredEndpointsAndMetadata()
    {
        using var factory = new DevelopmentApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/swagger/v1/swagger.json");
        var json = await response.Content.ReadAsStringAsync();
        Assert.True(response.IsSuccessStatusCode, $"Status: {response.StatusCode}, Body: {json}");
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        // Info checks
        var info = root.GetProperty("info");
        Assert.Equal("JobPulse API", info.GetProperty("title").GetString());
        Assert.Equal("v1", info.GetProperty("version").GetString());
        var description = info.GetProperty("description").GetString();
        Assert.NotNull(description);
        Assert.Contains("platform_registered", description);
        Assert.Contains("platform_tracked", description);
        Assert.Contains("platform_snapshots", description);
        Assert.Contains("India", description);

        // Paths checks
        var paths = root.GetProperty("paths");
        var expectedPaths = new[]
        {
            "/api/v1/dashboard/overview",
            "/api/v1/dashboard/trends",
            "/api/v1/dashboard/pressure-ratio",
            "/api/v1/jobs",
            "/api/v1/jobs/{id}",
            "/api/v1/jobs/import",
            "/api/v1/jobs/{id}/freshness",
            "/api/v1/job-seekers/active-count",
            "/api/v1/job-seekers/register",
            "/api/v1/job-seekers/status",
            "/api/v1/technologies",
            "/api/v1/locations",
            "/api/v1/dashboard/snapshots"
        };

        var pathList = paths.EnumerateObject().Select(p => p.Name).ToList();
        foreach (var path in expectedPaths)
        {
            Assert.True(paths.TryGetProperty(path, out _), $"Expected OpenAPI path '{path}' was not found. Available paths: {string.Join(", ", pathList)}");
        }

        // Verify CSV import multipart/form-data and binary file selector
        var importPath = paths.GetProperty("/api/v1/jobs/import").GetProperty("post");
        var requestBody = importPath.GetProperty("requestBody");
        var content = requestBody.GetProperty("content");
        Assert.True(content.TryGetProperty("multipart/form-data", out var multipartContent),
            "POST /api/v1/jobs/import must consume multipart/form-data.");

        var multipartSchema = multipartContent.GetProperty("schema");
        JsonElement targetSchema;
        if (multipartSchema.TryGetProperty("$ref", out var schemaRef))
        {
            var refName = schemaRef.GetString()!.Split('/').Last();
            targetSchema = root.GetProperty("components").GetProperty("schemas").GetProperty(refName);
        }
        else
        {
            targetSchema = multipartSchema;
        }

        var properties = targetSchema.GetProperty("properties");
        Assert.True(properties.TryGetProperty("file", out var fileProperty) || properties.TryGetProperty("File", out fileProperty));
        Assert.Equal("string", fileProperty.GetProperty("type").GetString());
        Assert.Equal("binary", fileProperty.GetProperty("format").GetString());

        // Verify date parameters on GET /api/v1/dashboard/trends
        var trendsParameters = paths.GetProperty("/api/v1/dashboard/trends").GetProperty("get").GetProperty("parameters");
        var fromParam = trendsParameters.EnumerateArray().FirstOrDefault(p => p.GetProperty("name").GetString() == "from");
        var toParam = trendsParameters.EnumerateArray().FirstOrDefault(p => p.GetProperty("name").GetString() == "to");

        Assert.Equal(JsonValueKind.Object, fromParam.ValueKind);
        Assert.Equal(JsonValueKind.Object, toParam.ValueKind);
        Assert.Equal("date", fromParam.GetProperty("schema").GetProperty("format").GetString());
        Assert.Equal("date", toParam.GetProperty("schema").GetProperty("format").GetString());

        // Verify response schemas exist
        var overviewResponses = paths.GetProperty("/api/v1/dashboard/overview").GetProperty("get").GetProperty("responses");
        Assert.True(overviewResponses.TryGetProperty("200", out _));

        var schemas = root.GetProperty("components").GetProperty("schemas");
        Assert.True(schemas.TryGetProperty("DashboardOverviewResponse", out _));
        Assert.True(schemas.TryGetProperty("JobListingImportSummary", out _));
        Assert.True(schemas.TryGetProperty("JobMarketPressureRatioResponse", out _));
    }

    [Fact]
    public async Task SwaggerUi_LoadsSuccessfullyInDevelopment()
    {
        using var factory = new DevelopmentApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/swagger/index.html");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var html = await response.Content.ReadAsStringAsync();
        Assert.Contains("swagger-ui", html, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task SwaggerUi_IsNotExposedInProduction()
    {
        using var factory = new ProductionApiFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/swagger/index.html");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
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

    private sealed class ProductionApiFactory : WebApplicationFactory<Program>
    {
        private readonly string _databaseName = Guid.NewGuid().ToString();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Production");
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
