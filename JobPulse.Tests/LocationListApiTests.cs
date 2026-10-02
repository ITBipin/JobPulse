using JobPulse.API.Controllers.V1;
using JobPulse.Application.Locations;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Locations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class LocationListApiTests
{
    [Fact]
    public async Task GetLocations_FiltersByCityAndReturnsAlphabeticalLocationDtos()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        var pune = new Location { City = "Pune", State = "Maharashtra", Country = "India" };
        var ahmedabad = new Location { City = "Ahmedabad", State = "Gujarat", Country = "India" };
        var mumbai = new Location { City = "Mumbai", State = "Maharashtra", Country = "India" };
        context.Locations.AddRange(pune, ahmedabad, mumbai);
        await context.SaveChangesAsync();

        var controller = new LocationsController(new LocationQueryService(context));

        var action = await controller.GetLocations("U", CancellationToken.None);
        var result = Assert.IsType<OkObjectResult>(action.Result);
        var locations = Assert.IsAssignableFrom<IReadOnlyList<LocationDto>>(result.Value);

        Assert.Collection(
            locations,
            location =>
            {
                Assert.Equal(mumbai.Id, location.Id);
                Assert.Equal("Mumbai", location.City);
                Assert.Equal("Maharashtra", location.State);
                Assert.Equal("India", location.Country);
            },
            location =>
            {
                Assert.Equal(pune.Id, location.Id);
                Assert.Equal("Pune", location.City);
                Assert.Equal("Maharashtra", location.State);
                Assert.Equal("India", location.Country);
            });
    }
}