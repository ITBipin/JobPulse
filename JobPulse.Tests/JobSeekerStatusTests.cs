using System.ComponentModel.DataAnnotations;
using JobPulse.Application.JobSeekers;
using JobPulse.Domain.Entities;
using JobPulse.Infrastructure.Data;
using JobPulse.Infrastructure.JobSeekers;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Tests;

public class JobSeekerStatusTests
{
    [Theory]
    [InlineData("OpenToWork")]
    [InlineData("NotLooking")]
    [InlineData("Hired")]
    public async Task UpdateStatusAsync_UpdatesStatusAndLastConfirmedAt(string status)
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new JobPulseDbContext(options);
        var previousConfirmation = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var jobSeeker = new JobSeeker
        {
            Source = "PublicRegistration",
            JobSearchStatus = "Unknown",
            LastConfirmedAt = previousConfirmation
        };
        context.JobSeekers.Add(jobSeeker);
        await context.SaveChangesAsync();

        var service = new JobSeekerStatusService(context);
        var result = await service.UpdateStatusAsync(new UpdateJobSeekerStatusRequest
        {
            JobSeekerId = jobSeeker.Id,
            Status = status
        });

        Assert.NotNull(result);
        Assert.Equal(status, result.Status);
        Assert.True(result.LastConfirmedAt > previousConfirmation);
        Assert.Equal(2, typeof(JobSeekerStatusUpdateResponse).GetProperties().Length);
        Assert.Equal(status, jobSeeker.JobSearchStatus);
        Assert.Equal(result.LastConfirmedAt, jobSeeker.LastConfirmedAt);
    }

    [Theory]
    [InlineData("ActivelySearching")]
    [InlineData("openToWork")]
    [InlineData("Unknown")]
    public void UpdateStatusRequest_RejectsUnsupportedStatus(string status)
    {
        var request = new UpdateJobSeekerStatusRequest
        {
            JobSeekerId = Guid.NewGuid(),
            Status = status
        };
        var errors = new List<ValidationResult>();

        var isValid = Validator.TryValidateObject(request, new ValidationContext(request), errors, validateAllProperties: true);

        Assert.False(isValid);
        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.Status)));
    }

    [Fact]
    public async Task UpdateStatusAsync_ReturnsNullWhenJobSeekerDoesNotExist()
    {
        var options = new DbContextOptionsBuilder<JobPulseDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new JobPulseDbContext(options);
        var service = new JobSeekerStatusService(context);

        var result = await service.UpdateStatusAsync(new UpdateJobSeekerStatusRequest
        {
            JobSeekerId = Guid.NewGuid(),
            Status = JobSeekerStatuses.OpenToWork
        });

        Assert.Null(result);
    }
}