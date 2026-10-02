using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Jobs;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class ActiveJobListingsByTechnologyServiceTests
{
    [Fact]
    public async Task GetActiveJobCountsByTechnologyAsync_GroupsActiveListingsAndExcludesInactiveListings()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        var csharp = new Technology { Name = "C#" };
        var python = new Technology { Name = "Python" };
        var inactiveOnly = new Technology { Name = "Retired Technology" };
        context.JobListings.AddRange(
            CreateListing(csharp, isActive: true),
            CreateListing(csharp, isActive: true),
            CreateListing(csharp, isActive: false),
            CreateListing(python, isActive: true),
            CreateListing(inactiveOnly, isActive: false));
        await context.SaveChangesAsync();

        var service = new ActiveJobListingsByTechnologyService(context);

        var results = await service.GetActiveJobCountsByTechnologyAsync();

        Assert.Collection(
            results,
            result =>
            {
                Assert.Equal(csharp.Id, result.TechnologyId);
                Assert.Equal("C#", result.TechnologyName);
                Assert.Equal(2, result.JobCount);
            },
            result =>
            {
                Assert.Equal(python.Id, result.TechnologyId);
                Assert.Equal("Python", result.TechnologyName);
                Assert.Equal(1, result.JobCount);
            });
    }

    [Fact]
    public async Task GetActiveJobCountsByTechnologyAsync_ReturnsEmptyWhenThereAreNoActiveListings()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        context.JobListings.Add(CreateListing(new Technology { Name = "C#" }, isActive: false));
        await context.SaveChangesAsync();

        var service = new ActiveJobListingsByTechnologyService(context);

        var results = await service.GetActiveJobCountsByTechnologyAsync();

        Assert.Empty(results);
    }

    private static JobListing CreateListing(Technology technology, bool isActive) => new()
    {
        Title = "Software Engineer",
        CompanyName = "Example",
        IsActive = isActive,
        Technology = technology,
        Location = new Location { City = $"City-{Guid.NewGuid():N}", Country = "India" },
        ExperienceRange = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = $"Range-{Guid.NewGuid():N}" },
        JobListingSource = new JobListingSource { Name = $"Source-{Guid.NewGuid():N}" }
    };
}