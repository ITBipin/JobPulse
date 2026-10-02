using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobListingSourceIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "JobListingSources",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobListingSources_IsActive",
                table: "JobListingSources",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_JobListingSources_IsActive",
                table: "JobListingSources");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "JobListingSources");
        }
    }
}
