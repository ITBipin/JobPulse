# JobPulse AI Development Rules

You are working on an existing project called JobPulse.

JobPulse is a public India Job Market Intelligence Dashboard.

## Goal

Build a real full-stack application that shows:

* Tracked job openings
* Voluntary active job seekers
* Technology-wise demand
* City-wise demand
* Experience-wise trends
* Historical trends
* Transparent job-market pressure ratio

Never claim that our database represents all job seekers in India.

## Technology

Backend:

* C#
* ASP.NET Core
* .NET 8
* Entity Framework Core
* SQL Server
* Clean Architecture

Frontend:

* Angular
* TypeScript
* Angular Material
* SCSS
* RxJS
* ECharts or Chart.js

Background:

* .NET Worker
* Hangfire only if actually required

Testing:

* xUnit
* Integration tests
* Angular tests

Deployment:

* Docker
* GitHub Actions
* Azure

## Architecture

Use a modular monolith.

Projects:

JobPulse.Domain
JobPulse.Application
JobPulse.Infrastructure
JobPulse.API
JobPulse.Worker
JobPulse.Tests

Frontend:

jobpulse-web

Do not create microservices unless there is a real requirement.

## Coding Rules

1. Inspect existing code before changing anything.
2. Never recreate files that already work.
3. Change only files required for the current task.
4. Do not generate unnecessary boilerplate.
5. Keep controllers thin.
6. Keep business logic in Application/Domain.
7. Keep database logic in Infrastructure.
8. Use dependency injection.
9. Use async/await for I/O.
10. Use cancellation tokens for long-running operations where appropriate.
11. Use DTOs for API contracts.
12. Validate all external input.
13. Never hardcode secrets.
14. Never invent external APIs.
15. Never invent real market statistics.
16. Mock/sample data must always be clearly labelled.
17. Do not collect unnecessary personal information.
18. Do not scrape private profiles.
19. Do not bypass CAPTCHA, authentication, robots restrictions, or anti-bot protection.
20. Respect source terms and licensing.

## Data Rules

Every external data record should preserve:

* Source
* Source identifier where available
* Collection date
* Original date
* Data quality status

Dashboard metrics must expose:

* Source
* Last updated
* Reporting period

Never convert unavailable data into zero.

## Development Rules

Work incrementally.

For each request:

1. Inspect relevant files.
2. Explain the smallest implementation required.
3. Modify only necessary files.
4. Run/build/test the affected area.
5. Fix compilation errors.
6. Report:

   * Files changed
   * What was implemented
   * Test/build result
   * Any remaining issue

Do NOT refactor unrelated code.

Do NOT regenerate the whole application.

Do NOT create documentation unless specifically requested.

## Token Efficiency

Be concise.

Do not repeat the project requirements in every response.

Do not paste complete existing files unless necessary.

When changing an existing file, inspect the file and make the smallest required change.

Prefer incremental edits over complete rewrites.

If a task can be completed in 3 files, do not modify 15 files.

## Current Development Principle

The application must remain runnable after every task.

Always prioritize:

Working code > abstraction > documentation.

Build the MVP first.

Advanced features come later.
