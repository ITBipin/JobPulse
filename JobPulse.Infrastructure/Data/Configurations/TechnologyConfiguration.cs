using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class TechnologyConfiguration : IEntityTypeConfiguration<Technology>
{
    public void Configure(EntityTypeBuilder<Technology> builder)
    {
        builder.ToTable("Technologies");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.HasIndex(x => x.Name)
            .IsUnique();

        builder.HasMany(x => x.JobListings)
            .WithOne(x => x.Technology)
            .HasForeignKey(x => x.TechnologyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
