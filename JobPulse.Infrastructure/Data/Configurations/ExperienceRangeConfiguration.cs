using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class ExperienceRangeConfiguration : IEntityTypeConfiguration<ExperienceRange>
{
    public void Configure(EntityTypeBuilder<ExperienceRange> builder)
    {
        builder.ToTable("ExperienceRanges");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Label)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => new { x.MinimumYears, x.MaximumYears })
            .IsUnique();

        builder.HasMany(x => x.JobListings)
            .WithOne(x => x.ExperienceRange)
            .HasForeignKey(x => x.ExperienceRangeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
