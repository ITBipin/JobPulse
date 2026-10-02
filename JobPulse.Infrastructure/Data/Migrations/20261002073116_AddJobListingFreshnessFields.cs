using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobListingFreshnessFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FreshnessStatus",
                table: "JobListings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Unknown");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LastSeenAt",
                table: "JobListings",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_LastSeenAt",
                table: "JobListings",
                column: "LastSeenAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JobListings_LastSeenAt",
                table: "JobListings");

            migrationBuilder.DropColumn(
                name: "FreshnessStatus",
                table: "JobListings");

            migrationBuilder.DropColumn(
                name: "LastSeenAt",
                table: "JobListings");
        }
    }
}
