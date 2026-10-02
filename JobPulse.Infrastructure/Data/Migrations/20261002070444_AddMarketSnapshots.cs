using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketSnapshots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MarketSnapshots",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SnapshotDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ActiveTrackedJobs = table.Column<int>(type: "int", nullable: false),
                    ActiveRegisteredJobSeekers = table.Column<int>(type: "int", nullable: false),
                    NewJobsLast7Days = table.Column<int>(type: "int", nullable: false),
                    NewJobsLast30Days = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MarketSnapshots", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MarketSnapshots_CreatedAt",
                table: "MarketSnapshots",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MarketSnapshots_SnapshotDate",
                table: "MarketSnapshots",
                column: "SnapshotDate",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MarketSnapshots");
        }
    }
}
