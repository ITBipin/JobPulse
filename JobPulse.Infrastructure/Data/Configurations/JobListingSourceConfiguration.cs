using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class JobListingSourceConfiguration : IEntityTypeConfiguration<JobListingSource>
{
    public void Configure(EntityTypeBuilder<JobListingSource> builder)
    {
        builder.ToTable("JobListingSources");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(x => x.SourceType).HasMaxLength(100);
        builder.Property(x => x.WebsiteUrl)
            .HasMaxLength(500);
        builder.Property(x => x.Description)
            .HasMaxLength(1000);
        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.HasIndex(x => x.Name)
            .IsUnique();
        builder.HasIndex(x => x.IsActive);

        builder.HasMany(x => x.JobListings)
            .WithOne(x => x.JobListingSource)
            .HasForeignKey(x => x.JobListingSourceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
