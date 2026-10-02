using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Jobs;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class JobListingReadTests
{
    [Fact]
    public async Task GetJobByIdAsync_ReturnsListingWithTechnologyLocationAndSource()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new JobPulseDbContext(options);
        var job = new JobListing
        {
            Title = "Backend Engineer",
            CompanyName = "Contoso",
            Technology = new Technology { Name = "C#" },
            Location = new Location { City = "Bengaluru", State = "Karnataka", Country = "India" },
            ExperienceRange = new ExperienceRange { MinimumYears = 2, MaximumYears = 5, Label = "2-5 years" },
            JobListingSource = new JobListingSource { Name = "Naukri", WebsiteUrl = "https://example.test" }
        };
        context.JobListings.Add(job);
        await context.SaveChangesAsync();

        var service = new JobListService(context);

        var result = await service.GetJobByIdAsync(job.Id);

        Assert.NotNull(result);
        Assert.Equal("Backend Engineer", result.Title);
        Assert.Equal("C#", result.Technology.Name);
        Assert.Equal("Bengaluru", result.Location.City);
        Assert.Equal("Karnataka", result.Location.State);
        Assert.Equal("Naukri", result.Source.Name);
    }

    [Fact]
    public async Task GetJobByIdAsync_ReturnsNullWhenListingDoesNotExist()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new JobPulseDbContext(options);
        var service = new JobListService(context);

        var result = await service.GetJobByIdAsync(Guid.NewGuid());

        Assert.Null(result);
    }
}