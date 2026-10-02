using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class JobImportBatchConfiguration : IEntityTypeConfiguration<JobImportBatch>
{
    public void Configure(EntityTypeBuilder<JobImportBatch> builder)
    {
        builder.ToTable("JobImportBatches");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.ErrorMessage)
            .HasMaxLength(2000);

        builder.Property(x => x.StartedAt)
            .IsRequired();

        builder.HasIndex(x => x.StartedAt);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.SourceId);

        builder.HasOne(x => x.Source)
            .WithMany(x => x.ImportBatches)
            .HasForeignKey(x => x.SourceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
