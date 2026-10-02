using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class UserConsentConfiguration : IEntityTypeConfiguration<UserConsent>
{
    public void Configure(EntityTypeBuilder<UserConsent> builder)
    {
        builder.ToTable("UserConsents");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.ConsentType)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(x => x.ConsentVersion)
            .HasMaxLength(50);
        builder.Property(x => x.Source)
            .HasMaxLength(200);
        builder.Property(x => x.DataQualityStatus)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Unknown");

        builder.HasIndex(x => x.JobSeekerId);
        builder.HasIndex(x => new { x.JobSeekerId, x.ConsentType, x.IsGranted });
        builder.HasIndex(x => x.GrantedAtUtc);
        builder.HasIndex(x => x.RevokedAtUtc);

        builder.HasOne(x => x.JobSeeker)
            .WithMany(x => x.Consents)
            .HasForeignKey(x => x.JobSeekerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
