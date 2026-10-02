import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, delay } from 'rxjs';
import { DemoDataService } from '../services/demo-data.service';

export function isStaticOrDemoEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  // If user explicitly configured a live backend URL, do not use demo data
  if (localStorage.getItem('jobpulse_custom_api_url')) {
    return false;
  }
  if (localStorage.getItem('jobpulse_live_backend') === 'true') {
    return false;
  }
  // Automatically activate on GitHub Pages or when explicitly enabled
  const hostname = window.location.hostname || '';
  if (hostname.includes('github.io') || hostname.includes('githubusercontent')) {
    return true;
  }
  if (localStorage.getItem('jobpulse_demo_mode') === 'true') {
    return true;
  }
  return false;
}

export const demoDataInterceptor: HttpInterceptorFn = (req, next) => {
  const demoService = inject(DemoDataService);

  // If a custom API base URL is stored, rewrite the request
  if (typeof window !== 'undefined') {
    const customApi = localStorage.getItem('jobpulse_custom_api_url');
    if (customApi && req.url.startsWith('/api/v1')) {
      const rewrittenUrl = req.url.replace('/api/v1', customApi.replace(/\/$/, ''));
      const cloned = req.clone({ url: rewrittenUrl });
      return next(cloned);
    }
  }

  // Check if we are in demo / GitHub Pages mode
  if (!isStaticOrDemoEnvironment()) {
    return next(req);
  }

  // Parse path and query params
  const urlObj = new URL(req.url, 'http://localhost');
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // 1. Dashboard Overview
  if (pathname === '/api/v1/dashboard/overview' && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: demoService.getOverview() })).pipe(delay(120));
  }

  // 2. Dashboard Trends
  if (pathname === '/api/v1/dashboard/trends' && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: demoService.getTrends() })).pipe(delay(150));
  }

  // 3. Pressure Ratio
  if (pathname === '/api/v1/dashboard/pressure-ratio' && req.method === 'GET') {
    const techId = searchParams.get('technologyId') || undefined;
    const locId = searchParams.get('locationId') || undefined;
    const expId = searchParams.get('experienceRangeId') || undefined;
    return of(
      new HttpResponse({
        status: 200,
        body: demoService.getPressureRatio({
          technologyId: techId,
          locationId: locId,
          experienceRangeId: expId
        })
      })
    ).pipe(delay(120));
  }

  // 4. Job Freshness
  const freshnessMatch = pathname.match(/^\/api\/v1\/jobs\/([^/]+)\/freshness$/);
  if (freshnessMatch && req.method === 'GET') {
    const jobId = freshnessMatch[1];
    return of(new HttpResponse({ status: 200, body: demoService.getJobFreshness(jobId) })).pipe(delay(100));
  }

  // 5. Job Details
  const jobDetailMatch = pathname.match(/^\/api\/v1\/jobs\/([^/]+)$/);
  if (jobDetailMatch && req.method === 'GET') {
    const jobId = jobDetailMatch[1];
    return of(new HttpResponse({ status: 200, body: demoService.getJobById(jobId) })).pipe(delay(150));
  }

  // 6. Job Listing
  if (pathname === '/api/v1/jobs' && req.method === 'GET') {
    const search = searchParams.get('search') || undefined;
    const tech = searchParams.get('technology') || undefined;
    const loc = searchParams.get('location') || undefined;
    const exp = searchParams.get('experience') || undefined;
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    return of(
      new HttpResponse({
        status: 200,
        body: demoService.getJobs(search, tech, loc, exp, pageNumber, pageSize)
      })
    ).pipe(delay(150));
  }

  // 7. Technologies Lookup
  if (pathname === '/api/v1/technologies' && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: demoService.getTechnologies() })).pipe(delay(100));
  }

  // 8. Locations Lookup
  if (pathname === '/api/v1/locations' && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: demoService.getLocations() })).pipe(delay(100));
  }

  // 9. Active Seeker Count
  if (pathname === '/api/v1/job-seekers/active-count' && req.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: demoService.getActiveSeekerCount() })).pipe(delay(100));
  }

  // 10. Seeker Registration
  if (pathname === '/api/v1/job-seekers/register' && req.method === 'POST') {
    return of(new HttpResponse({ status: 200, body: demoService.registerJobSeeker(req.body as any) })).pipe(delay(300));
  }

  // 11. Seeker Status Update
  if (pathname === '/api/v1/job-seekers/status' && req.method === 'PUT') {
    return of(new HttpResponse({ status: 200, body: demoService.updateJobSeekerStatus(req.body as any) })).pipe(delay(250));
  }

  return next(req);
};
