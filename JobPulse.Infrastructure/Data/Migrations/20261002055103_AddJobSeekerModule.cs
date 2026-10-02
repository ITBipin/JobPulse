using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobSeekerModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobSeekers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Source = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SourceIdentifier = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CollectedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OriginalRecordedDateUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataQualityStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Unknown"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: true),
                    PreferredWorkMode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    City = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    State = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobSeekers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobSeekerSkills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobSeekerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TechnologyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: true),
                    ProficiencyLevel = table.Column<int>(type: "int", nullable: true),
                    LastUpdatedUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Source = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobSeekerSkills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobSeekerSkills_JobSeekers_JobSeekerId",
                        column: x => x.JobSeekerId,
                        principalTable: "JobSeekers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobSeekerSkills_Technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalTable: "Technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserConsents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JobSeekerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConsentType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsGranted = table.Column<bool>(type: "bit", nullable: false),
                    GrantedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RevokedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ConsentVersion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Source = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DataQualityStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "Unknown"),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserConsents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserConsents_JobSeekers_JobSeekerId",
                        column: x => x.JobSeekerId,
                        principalTable: "JobSeekers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekers_CollectedAtUtc",
                table: "JobSeekers",
                column: "CollectedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekers_IsActive",
                table: "JobSeekers",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekers_OriginalRecordedDateUtc",
                table: "JobSeekers",
                column: "OriginalRecordedDateUtc");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekers_Source_SourceIdentifier",
                table: "JobSeekers",
                columns: new[] { "Source", "SourceIdentifier" },
                unique: true,
                filter: "[SourceIdentifier] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekers_SourceIdentifier",
                table: "JobSeekers",
                column: "SourceIdentifier");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekerSkills_JobSeekerId",
                table: "JobSeekerSkills",
                column: "JobSeekerId");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekerSkills_JobSeekerId_TechnologyId",
                table: "JobSeekerSkills",
                columns: new[] { "JobSeekerId", "TechnologyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekerSkills_LastUpdatedUtc",
                table: "JobSeekerSkills",
                column: "LastUpdatedUtc");

            migrationBuilder.CreateIndex(
                name: "IX_JobSeekerSkills_TechnologyId",
                table: "JobSeekerSkills",
                column: "TechnologyId");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_GrantedAtUtc",
                table: "UserConsents",
                column: "GrantedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_JobSeekerId",
                table: "UserConsents",
                column: "JobSeekerId");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_JobSeekerId_ConsentType_IsGranted",
                table: "UserConsents",
                columns: new[] { "JobSeekerId", "ConsentType", "IsGranted" });

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_RevokedAtUtc",
                table: "UserConsents",
                column: "RevokedAtUtc");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobSeekerSkills");

            migrationBuilder.DropTable(
                name: "UserConsents");

            migrationBuilder.DropTable(
                name: "JobSeekers");
        }
    }
}
