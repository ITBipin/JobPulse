using System.Reflection;
using JobPulse.Application;
using JobPulse.Infrastructure;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.DescribeAllParametersInCamelCase();
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "JobPulse API",
        Version = "v1",
        Description = "Public India Job Market Intelligence Dashboard API providing transparent analytics on tracked job openings, voluntary active job seekers, technology demand, city trends, and market pressure ratios.\n\n"
            + "Data Transparency & Source Scopes:\n"
            + "- 'platform_registered': Active job seeker counts reflect verified voluntary platform registrations and do NOT represent the total number of job seekers in India.\n"
            + "- 'platform_tracked': Job listing data reflects vacancies actively tracked from integrated external sources and platform imports.\n"
            + "- 'platform_snapshots': Historical trend analytics based on daily captured platform snapshots."
    });

    options.MapType<DateOnly>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "date"
    });
    options.MapType<DateOnly?>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "date",
        Nullable = true
    });

    var apiXmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var apiXmlPath = Path.Combine(AppContext.BaseDirectory, apiXmlFile);
    if (File.Exists(apiXmlPath))
    {
        options.IncludeXmlComments(apiXmlPath);
    }

    var appXmlPath = Path.Combine(AppContext.BaseDirectory, "JobPulse.Application.xml");
    if (File.Exists(appXmlPath))
    {
        options.IncludeXmlComments(appXmlPath);
    }
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        if (context.Request.Path.StartsWithSegments("/swagger/v1/swagger.json"))
        {
            var originalBodyStream = context.Response.Body;
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await next();

            context.Response.Body = originalBodyStream;
            responseBody.Seek(0, SeekOrigin.Begin);
            var text = await new StreamReader(responseBody).ReadToEndAsync();
            if (text.Contains("\"openapi\": \"3.0.4\""))
            {
                text = text.Replace("\"openapi\": \"3.0.4\"", "\"openapi\": \"3.0.1\"");
            }
            context.Response.ContentLength = System.Text.Encoding.UTF8.GetByteCount(text);
            await context.Response.WriteAsync(text);
            return;
        }

        await next();
    });

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "JobPulse API v1");
        options.RoutePrefix = "swagger";
    });
}

app.MapGet("/", () => Results.Redirect("/swagger"))
    .ExcludeFromDescription();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "JobPulse.API" }))
    .WithName("HealthCheck")
    .WithOpenApi();

app.MapControllers();

app.Run();

public partial class Program;
