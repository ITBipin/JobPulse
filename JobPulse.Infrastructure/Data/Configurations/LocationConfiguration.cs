using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.ToTable("Locations");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.City)
            .IsRequired()
            .HasMaxLength(200);
        builder.Property(x => x.State)
            .HasMaxLength(200);
        builder.Property(x => x.Country)
            .IsRequired()
            .HasMaxLength(200)
            .HasDefaultValue("India");
        builder.Property(x => x.Region)
            .HasMaxLength(200);

        builder.HasIndex(x => new { x.City, x.State, x.Country })
            .IsUnique();

        builder.HasMany(x => x.JobListings)
            .WithOne(x => x.Location)
            .HasForeignKey(x => x.LocationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
