using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ExperienceRanges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MinimumYears = table.Column<int>(type: "int", nullable: false),
                    MaximumYears = table.Column<int>(type: "int", nullable: true),
                    Label = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExperienceRanges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobListingSources",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    WebsiteUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobListingSources", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    City = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    State = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false, defaultValue: "India"),
                    Region = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Technologies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Technologies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobListings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    JobUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SourceIdentifier = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CollectedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OriginalPostedDateUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataQualityStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Unknown"),
                    WorkMode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EmploymentType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SalaryMin = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    SalaryMax = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TechnologyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExperienceRangeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobListingSourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobListings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobListings_ExperienceRanges_ExperienceRangeId",
                        column: x => x.ExperienceRangeId,
                        principalTable: "ExperienceRanges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobListings_JobListingSources_JobListingSourceId",
                        column: x => x.JobListingSourceId,
                        principalTable: "JobListingSources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobListings_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_JobListings_Technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalTable: "Technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExperienceRanges_MinimumYears_MaximumYears",
                table: "ExperienceRanges",
                columns: new[] { "MinimumYears", "MaximumYears" },
                unique: true,
                filter: "[MaximumYears] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_CollectedAtUtc",
                table: "JobListings",
                column: "CollectedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_CompanyName",
                table: "JobListings",
                column: "CompanyName");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_ExperienceRangeId",
                table: "JobListings",
                column: "ExperienceRangeId");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_JobListingSourceId",
                table: "JobListings",
                column: "JobListingSourceId");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_LocationId",
                table: "JobListings",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_OriginalPostedDateUtc",
                table: "JobListings",
                column: "OriginalPostedDateUtc");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_SourceIdentifier",
                table: "JobListings",
                column: "SourceIdentifier");

            migrationBuilder.CreateIndex(
                name: "IX_JobListings_TechnologyId",
                table: "JobListings",
                column: "TechnologyId");

            migrationBuilder.CreateIndex(
                name: "IX_JobListingSources_Name",
                table: "JobListingSources",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Locations_City_State_Country",
                table: "Locations",
                columns: new[] { "City", "State", "Country" },
                unique: true,
                filter: "[State] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Technologies_Name",
                table: "Technologies",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobListings");

            migrationBuilder.DropTable(
                name: "ExperienceRanges");

            migrationBuilder.DropTable(
                name: "JobListingSources");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Technologies");
        }
    }
}
