using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPulse.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobImportBatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "JobImportBatches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    StartedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CompletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    TotalRows = table.Column<int>(type: "int", nullable: false),
                    ImportedRows = table.Column<int>(type: "int", nullable: false),
                    DuplicateRows = table.Column<int>(type: "int", nullable: false),
                    InvalidRows = table.Column<int>(type: "int", nullable: false),
                    SkippedRows = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ErrorMessage = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobImportBatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobImportBatches_JobListingSources_SourceId",
                        column: x => x.SourceId,
                        principalTable: "JobListingSources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobImportBatches_SourceId",
                table: "JobImportBatches",
                column: "SourceId");

            migrationBuilder.CreateIndex(
                name: "IX_JobImportBatches_StartedAt",
                table: "JobImportBatches",
                column: "StartedAt");

            migrationBuilder.CreateIndex(
                name: "IX_JobImportBatches_Status",
                table: "JobImportBatches",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobImportBatches");
        }
    }
}
