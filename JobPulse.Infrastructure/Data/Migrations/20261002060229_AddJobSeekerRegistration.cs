using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobSeekerRegistration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ExperienceRangeId",
                table: "JobSeekers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "JobSearchStartDate",
                table: "JobSeekers",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobSearchStatus",
                table: "JobSeekers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Unknown");

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "JobSeekers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalaryMax",
                table: "JobSeekers",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalaryMin",
                table: "JobSeekers",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekers_ExperienceRangeId",
                table: "JobSeekers",
                column: "ExperienceRangeId");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekers_LocationId",
                table: "JobSeekers",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobSeekers_ExperienceRanges_ExperienceRangeId",
                table: "JobSeekers",
                column: "ExperienceRangeId",
                principalTable: "ExperienceRanges",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_JobSeekers_Locations_LocationId",
                table: "JobSeekers",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobSeekers_ExperienceRanges_ExperienceRangeId",
                table: "JobSeekers");

            migrationBuilder.DropForeignKey(
                name: "FK_JobSeekers_Locations_LocationId",
                table: "JobSeekers");

            migrationBuilder.DropIndex(
                name: "IX_JobSeekers_ExperienceRangeId",
                table: "JobSeekers");

            migrationBuilder.DropIndex(
                name: "IX_JobSeekers_LocationId",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "ExperienceRangeId",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "JobSearchStartDate",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "JobSearchStatus",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "SalaryMax",
                table: "JobSeekers");

            migrationBuilder.DropColumn(
                name: "SalaryMin",
                table: "JobSeekers");
        }
    }
}
