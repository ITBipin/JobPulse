# JobPulse Web — India Job Market Intelligence Dashboard

The frontend application for **JobPulse**, providing an open, transparent, and privacy-preserving job market intelligence dashboard for the Indian technology ecosystem.

Built with **Angular 21** (Standalone Architecture), **TypeScript**, **Angular Material**, **SCSS**, **RxJS**, and **Apache ECharts**.

---

## 🏗️ Architecture & Features

* **Strict Backend Integration:** Communicates exclusively with verified ASP.NET Core backend endpoints (`/api/v1`). No fabricated market data or mock metrics in production.
* **Component System:** 100% standalone components, Angular Signals for state reactivity, and optimized change detection.
* **Responsive Visualizations:** Powered by Apache ECharts using responsive vector SVG rendering with dark/light mode synchronization.
* **Server-Side Pagination & URL Sync:** Job Explorer syncs query parameters (`search`, `technology`, `location`, `page`, `pageSize`) bidirectionally with browser history.
* **Privacy-Preserving Voluntary Portal:** Allows job seekers to participate anonymously with zero PII collection (no resumes, phone numbers, or full names).
* **Data Freshness SLAs:** Displays verification status (`Fresh` <24h, `Stale` 24–72h, `Expired` >72h) and data quality classifications for every listing.
* **WCAG 2.1 AA Accessibility:** Keyboard skip navigation, `:focus-visible` ring indicators, semantic HTML landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`), and accessible ARIA attributes.
* **Centralized Error Handling:** Robust interceptor mapping HTTP 400 (validation), 401, 403, 404, 413, 429, 500/502/503/504, and network disconnection states with user-friendly retry banners.

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher
* **JobPulse Backend API**: Running at `http://localhost:5218` (see backend documentation in repository root)

### Installation

```bash
cd jobpulse-web
npm install --legacy-peer-deps
```

### Development Server

Run the development server with local API proxy forwarding:

```bash
npm start
```

Navigate to `http://localhost:4200/`.
API calls to `/api/v1/*` are automatically forwarded to `http://localhost:5218` via `proxy.conf.json`.

---

## 🧪 Testing

Run the Vitest test suite in single-run mode:

```bash
npm test -- --run
```

All 26 test suites (86+ unit and integration tests) verify:
* Centralized HTTP error interceptor (400, 401, 403, 404, 413, 429, 500, 503, status 0).
* Core API services (`DashboardService`, `JobService`, `JobSeekerService`, `TechnologyService`, `LocationService`).
* Dashboard overview, KPI cards, ECharts data transformation, and Market Pressure Ratio card.
* Job explorer table/mobile cards, server pagination, and job details freshness SLAs.
* Job seeker registration form validations, explicit consent checkbox, and status update workflows.
* Application routing integration with deep links and 404 fallback redirection.

---

## 📦 Production Build

Compile the production bundle:

```bash
npm run build
```

The compiled assets will be output to `dist/jobpulse-web/` with content hashing (`outputHashing: "all"`) and bundle optimization enabled.

---

## 🐳 Docker & Hosting Deployment

### Production Nginx Container

1. Build the production Docker image:

```bash
docker build -t jobpulse-web:latest .
```

2. Run the container:

```bash
docker run -d -p 80:80 --name jobpulse-web jobpulse-web:latest
```

### Static Hosting & SPA Routing Notes

When deploying to static hosting (AWS S3/CloudFront, Azure Static Web Apps, Cloudflare Pages, or Nginx):
* **SPA Fallback Routing**: Ensure all non-file route requests fallback to `/index.html`. In Nginx, this is handled via:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
* **CORS Configuration**: If the API is hosted on a separate domain (e.g., `https://api.jobpulse.in`), configure CORS headers on the ASP.NET Core backend to allow requests from the frontend domain.
