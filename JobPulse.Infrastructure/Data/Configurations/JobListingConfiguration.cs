using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class JobListingConfiguration : IEntityTypeConfiguration<JobListing>
{
    public void Configure(EntityTypeBuilder<JobListing> builder)
    {
        builder.ToTable("JobListings");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(300);
        builder.Property(x => x.CompanyName)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(x => x.JobUrl)
            .HasMaxLength(500);
        builder.Property(x => x.SourceIdentifier)
            .HasMaxLength(200);
        builder.Property(x => x.LastSeenAt).HasColumnName("LastSeenAt");
        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);
        builder.Property(x => x.DataQualityStatus)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Unknown");
        builder.Property(x => x.WorkMode)
            .HasMaxLength(50);
        builder.Property(x => x.EmploymentType)
            .HasMaxLength(50);
        builder.Property(x => x.SalaryMin)
            .HasPrecision(18, 2);
        builder.Property(x => x.SalaryMax)
            .HasPrecision(18, 2);
        builder.Property(x => x.Description)
            .HasColumnType("nvarchar(max)");

        builder.HasIndex(x => x.SourceIdentifier);
        builder.HasIndex(x => new { x.JobListingSourceId, x.SourceIdentifier })
            .IsUnique()
            .HasFilter("[SourceIdentifier] IS NOT NULL");
        builder.HasIndex(x => new { x.IsActive, x.TechnologyId });
        builder.HasIndex(x => x.CollectedAtUtc);
        builder.HasIndex(x => x.LastSeenAt);
        builder.HasIndex(x => x.DataQualityStatus);
        builder.HasIndex(x => x.OriginalPostedDateUtc);
        builder.HasIndex(x => x.TechnologyId);
        builder.HasIndex(x => x.LocationId);
        builder.HasIndex(x => x.ExperienceRangeId);
        builder.HasIndex(x => x.JobListingSourceId);
        builder.HasIndex(x => x.CompanyName);

        builder.HasOne(x => x.Technology)
            .WithMany(x => x.JobListings)
            .HasForeignKey(x => x.TechnologyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Location)
            .WithMany(x => x.JobListings)
            .HasForeignKey(x => x.LocationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.ExperienceRange)
            .WithMany(x => x.JobListings)
            .HasForeignKey(x => x.ExperienceRangeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.JobListingSource)
            .WithMany(x => x.JobListings)
            .HasForeignKey(x => x.JobListingSourceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
