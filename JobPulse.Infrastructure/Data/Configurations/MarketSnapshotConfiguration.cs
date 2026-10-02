using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public sealed class MarketSnapshotConfiguration : IEntityTypeConfiguration<MarketSnapshot>
{
    public void Configure(EntityTypeBuilder<MarketSnapshot> builder)
    {
        builder.ToTable("MarketSnapshots");

        builder.HasKey(snapshot => snapshot.Id);
        builder.Property(snapshot => snapshot.SnapshotDate)
            .HasColumnType("date")
            .IsRequired();
        builder.Property(snapshot => snapshot.ActiveTrackedJobs)
            .IsRequired();
        builder.Property(snapshot => snapshot.ActiveRegisteredJobSeekers)
            .IsRequired();
        builder.Property(snapshot => snapshot.NewJobsLast7Days)
            .IsRequired();
        builder.Property(snapshot => snapshot.NewJobsLast30Days)
            .IsRequired();
        builder.Property(snapshot => snapshot.CreatedAt)
            .IsRequired();

        builder.HasIndex(snapshot => snapshot.SnapshotDate)
            .IsUnique();
        builder.HasIndex(snapshot => snapshot.CreatedAt);
    }
}