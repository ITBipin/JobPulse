using JobPulse.Application;
using JobPulse.Domain.Common;
using JobPulse.Infrastructure;

namespace JobPulse.Tests;

public class SolutionStructureTests
{
    [Fact]
    public void BackendProjects_ArePresent()
    {
        Assert.NotNull(typeof(EntityBase));
        Assert.NotNull(typeof(ApplicationDependencyInjection));
        Assert.NotNull(typeof(InfrastructureDependencyInjection));
    }
}
