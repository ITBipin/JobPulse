using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueJobListingSourceIdentifier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_JobListings_JobListingSourceId_SourceIdentifier",
                table: "JobListings",
                columns: new[] { "JobListingSourceId", "SourceIdentifier" },
                unique: true,
                filter: "[SourceIdentifier] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JobListings_JobListingSourceId_SourceIdentifier",
                table: "JobListings");
        }
    }
}
