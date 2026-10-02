using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Jobs;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class ActiveJobListingsByCityServiceTests
{
    [Fact]
    public async Task GetActiveJobCountsByCityAsync_GroupsActiveListingsByLocationAndExcludesInactiveListings()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        var alphaKarnataka = new Location { City = "Alpha", State = "Karnataka", Country = "India" };
        var alphaTamilNadu = new Location { City = "Alpha", State = "Tamil Nadu", Country = "India" };
        var beta = new Location { City = "Beta", State = null, Country = "India" };
        context.JobListings.AddRange(
            CreateListing(alphaKarnataka, isActive: true),
            CreateListing(alphaKarnataka, isActive: true),
            CreateListing(alphaKarnataka, isActive: false),
            CreateListing(alphaTamilNadu, isActive: true),
            CreateListing(beta, isActive: false));
        await context.SaveChangesAsync();

        var service = new ActiveJobListingsByCityService(context);

        var results = await service.GetActiveJobCountsByCityAsync();

        Assert.Collection(
            results,
            result =>
            {
                Assert.Equal(alphaKarnataka.Id, result.LocationId);
                Assert.Equal("Alpha", result.City);
                Assert.Equal("Karnataka", result.State);
                Assert.Equal(2, result.JobCount);
            },
            result =>
            {
                Assert.Equal(alphaTamilNadu.Id, result.LocationId);
                Assert.Equal("Alpha", result.City);
                Assert.Equal("Tamil Nadu", result.State);
                Assert.Equal(1, result.JobCount);
            });
    }

    [Fact]
    public async Task GetActiveJobCountsByCityAsync_ReturnsEmptyWhenThereAreNoActiveListings()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        context.JobListings.Add(CreateListing(
            new Location { City = "Alpha", State = "Karnataka", Country = "India" },
            isActive: false));
        await context.SaveChangesAsync();

        var service = new ActiveJobListingsByCityService(context);

        var results = await service.GetActiveJobCountsByCityAsync();

        Assert.Empty(results);
    }

    private static JobListing CreateListing(Location location, bool isActive) => new()
    {
        Title = "Software Engineer",
        CompanyName = "Example",
        IsActive = isActive,
        Technology = new Technology { Name = $"Technology-{Guid.NewGuid():N}" },
        Location = location,
        ExperienceRange = new ExperienceRange { MinimumYears = 1, MaximumYears = 3, Label = $"Range-{Guid.NewGuid():N}" },
        JobListingSource = new JobListingSource { Name = $"Source-{Guid.NewGuid():N}" }
    };
}