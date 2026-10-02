using JobPulse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobPulse.Infrastructure.Data.Configurations;

public class JobSeekerSkillConfiguration : IEntityTypeConfiguration<JobSeekerSkill>
{
    public void Configure(EntityTypeBuilder<JobSeekerSkill> builder)
    {
        builder.ToTable("JobSeekerSkills");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Source)
            .HasMaxLength(200);

        builder.HasIndex(x => x.JobSeekerId);
        builder.HasIndex(x => x.TechnologyId);
        builder.HasIndex(x => x.LastUpdatedUtc);
        builder.HasIndex(x => new { x.JobSeekerId, x.TechnologyId })
            .IsUnique();

        builder.HasOne(x => x.JobSeeker)
            .WithMany(x => x.Skills)
            .HasForeignKey(x => x.JobSeekerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Technology)
            .WithMany()
            .HasForeignKey(x => x.TechnologyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
