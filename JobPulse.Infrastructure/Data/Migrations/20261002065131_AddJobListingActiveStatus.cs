using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobListingActiveStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "JobListings",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_IsActive_TechnologyId",
                table: "JobListings",
                columns: new[] { "IsActive", "TechnologyId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JobListings_IsActive_TechnologyId",
                table: "JobListings");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "JobListings");
        }
    }
}
