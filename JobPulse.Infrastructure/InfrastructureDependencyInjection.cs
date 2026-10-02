using JobPulse.Application;
using JobPulse.Application.Dashboard;
using JobPulse.Application.Jobs;
using JobPulse.Application.JobSeekers;
using JobPulse.Application.Locations;
using JobPulse.Application.Technologies;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Dashboard;
using JobPulse.Infrastructure.Jobs;
using JobPulse.Infrastructure.JobSeekers;
using JobPulse.Infrastructure.Locations;
using JobPulse.Infrastructure.Technologies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JobPulse.Infrastructure;

public static class InfrastructureDependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);

        services.AddApplication();

        var confirmationPeriodValue = configuration["JobSeekerActivity:ConfirmationPeriodDays"];
        var confirmationPeriodDays = 30;
        if (confirmationPeriodValue is not null &&
            (!int.TryParse(confirmationPeriodValue, out confirmationPeriodDays) || confirmationPeriodDays <= 0))
        {
            throw new InvalidOperationException("JobSeekerActivity:ConfirmationPeriodDays must be a positive integer.");
        }

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not configured.");

        services.AddDbContext<JobPulseDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IDashboardOverviewService, DashboardOverviewService>();
        services.AddScoped<IDashboardTrendsService, DashboardTrendsService>();
        services.AddScoped<IMarketSnapshotService, MarketSnapshotService>();
        services.AddScoped<IJobMarketPressureRatioService, JobMarketPressureRatioService>();
        services.AddScoped<IJobListService, JobListService>();
        services.AddScoped<IJobListingImportService, JobListingImportService>();
        var freshnessOptions = new JobFreshnessOptions(
            ReadFreshnessHours(configuration, "JobDataFreshness:FreshHours", 24),
            ReadFreshnessHours(configuration, "JobDataFreshness:StaleThroughHours", 72));
        if (freshnessOptions.StaleFor <= freshnessOptions.FreshFor)
            throw new InvalidOperationException("JobDataFreshness:StaleThroughHours must exceed FreshHours.");
        services.AddSingleton(freshnessOptions);
        services.AddScoped<IJobDataFreshnessService, JobDataFreshnessService>();
        services.AddScoped<IJobListingExpiryService, JobListingExpiryService>();
        services.AddScoped<IJobListingStatisticsService, JobListingStatisticsService>();
        services.AddScoped<IActiveJobListingsByTechnologyService, ActiveJobListingsByTechnologyService>();
        services.AddScoped<IActiveJobListingsByCityService, ActiveJobListingsByCityService>();
        services.AddScoped<IJobSeekerRegistrationService, JobSeekerRegistrationService>();
        services.AddScoped<IJobSeekerStatusService, JobSeekerStatusService>();
        services.AddSingleton(new JobSeekerActivityOptions(confirmationPeriodDays));
        services.AddSingleton<TimeProvider>(TimeProvider.System);
        services.AddScoped<IActiveJobSeekerCountService, ActiveJobSeekerCountService>();
        services.AddScoped<ITechnologyQueryService, TechnologyQueryService>();
        services.AddScoped<ILocationQueryService, LocationQueryService>();

        return services;
    }

    private static TimeSpan ReadFreshnessHours(IConfiguration configuration, string key, int defaultValue)
    {
        var value = configuration[key];
        if (value is null) return TimeSpan.FromHours(defaultValue);
        if (!int.TryParse(value, out var hours) || hours <= 0)
            throw new InvalidOperationException($"{key} must be a positive integer.");
        return TimeSpan.FromHours(hours);
    }
}
