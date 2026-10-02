using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobDataQualityFreshness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE [JobListings] SET [LastSeenAt] = TODATETIMEOFFSET([CollectedAtUtc], '+00:00') WHERE [LastSeenAt] IS NULL");
            migrationBuilder.DropColumn(
                name: "FreshnessStatus",
                table: "JobListings");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastSuccessfulCollectionAt",
                table: "JobListingSources",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceType",
                table: "JobListingSources",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "LastSeenAt",
                table: "JobListings",
                type: "datetimeoffset",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastSuccessfulCollectionAt",
                table: "JobListingSources");

            migrationBuilder.DropColumn(
                name: "SourceType",
                table: "JobListingSources");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "LastSeenAt",
                table: "JobListings",
                type: "datetimeoffset",
                nullable: true,
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset");

            migrationBuilder.AddColumn<string>(
                name: "FreshnessStatus",
                table: "JobListings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Unknown");
        }
    }
}
