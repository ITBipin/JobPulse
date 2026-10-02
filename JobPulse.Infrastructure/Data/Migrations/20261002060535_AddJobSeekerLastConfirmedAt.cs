using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobSeekerLastConfirmedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastConfirmedAt",
                table: "JobSeekers",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastConfirmedAt",
                table: "JobSeekers");
        }
    }
}
