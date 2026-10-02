using JobPulse.API.Controllers.V1;
using JobPulse.Application.Technologies;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.Technologies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class TechnologyListApiTests
{
    [Fact]
    public async Task GetTechnologies_SearchesByNameAndReturnsAlphabeticalDtosWithActiveStatus()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var context = new JobPulseDbContext(options);
        var python = new Technology { Name = "Python", IsActive = true };
        var typescript = new Technology { Name = "TypeScript", IsActive = false };
        var javascript = new Technology { Name = "JavaScript", IsActive = true };
        context.Technologies.AddRange(python, typescript, javascript);
        await context.SaveChangesAsync();

        var controller = new TechnologiesController(new TechnologyQueryService(context));

        var action = await controller.GetTechnologies("script", CancellationToken.None);
        var result = Assert.IsType<OkObjectResult>(action.Result);
        var technologies = Assert.IsAssignableFrom<IReadOnlyList<TechnologyDto>>(result.Value);

        Assert.Collection(
            technologies,
            technology =>
            {
                Assert.Equal(javascript.Id, technology.Id);
                Assert.Equal("JavaScript", technology.Name);
                Assert.True(technology.IsActive);
            },
            technology =>
            {
                Assert.Equal(typescript.Id, technology.Id);
                Assert.Equal("TypeScript", technology.Name);
                Assert.False(technology.IsActive);
            });
    }
}