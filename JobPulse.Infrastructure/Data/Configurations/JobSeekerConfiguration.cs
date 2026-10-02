using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class JobSeekerConfiguration : IEntityTypeConfiguration<JobSeeker>
{
    public void Configure(EntityTypeBuilder<JobSeeker> builder)
    {
        builder.ToTable("JobSeekers");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Source)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(x => x.SourceIdentifier)
            .HasMaxLength(200);
        builder.Property(x => x.DataQualityStatus)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Unknown");
        builder.Property(x => x.JobSearchStatus)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Unknown");
        builder.Property(x => x.LastConfirmedAt);
        builder.Property(x => x.SalaryMin)
            .HasPrecision(18, 2);
        builder.Property(x => x.SalaryMax)
            .HasPrecision(18, 2);
        builder.Property(x => x.PreferredWorkMode)
            .HasMaxLength(50);
        builder.Property(x => x.City)
            .HasMaxLength(200);
        builder.Property(x => x.State)
            .HasMaxLength(200);

        builder.HasIndex(x => x.IsActive);
        builder.HasIndex(x => x.CollectedAtUtc);
        builder.HasIndex(x => x.OriginalRecordedDateUtc);
        builder.HasIndex(x => x.SourceIdentifier);
        builder.HasIndex(x => new { x.Source, x.SourceIdentifier })
            .IsUnique();

        builder.HasMany(x => x.Skills)
            .WithOne(x => x.JobSeeker)
            .HasForeignKey(x => x.JobSeekerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Consents)
            .WithOne(x => x.JobSeeker)
            .HasForeignKey(x => x.JobSeekerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ExperienceRange)
            .WithMany(x => x.JobSeekers)
            .HasForeignKey(x => x.ExperienceRangeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Location)
            .WithMany(x => x.JobSeekers)
            .HasForeignKey(x => x.LocationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
