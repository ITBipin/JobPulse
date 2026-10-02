using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobPulse.Infrastructure.Data;

public class JobPulseDbContext : DbContext
{
    public JobPulseDbContext(DbContextOptions<JobPulseDbContext> options) : base(options)
    {
    }

    public DbSet<Technology> Technologies => Set<Technology>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<ExperienceRange> ExperienceRanges => Set<ExperienceRange>();
    public DbSet<JobListingSource> JobListingSources => Set<JobListingSource>();
    public DbSet<JobListing> JobListings => Set<JobListing>();
    public DbSet<JobSeeker> JobSeekers => Set<JobSeeker>();
    public DbSet<JobSeekerSkill> JobSeekerSkills => Set<JobSeekerSkill>();
    public DbSet<UserConsent> UserConsents => Set<UserConsent>();
    public DbSet<MarketSnapshot> MarketSnapshots => Set<MarketSnapshot>();
    public DbSet<JobImportBatch> JobImportBatches => Set<JobImportBatch>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(JobPulseDbContext).Assembly);
    }
}
