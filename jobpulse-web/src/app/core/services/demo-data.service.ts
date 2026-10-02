import { Injectable } from '@angular/core';
import {
  DashboardOverviewResponse,
  DashboardTrendsResponse,
  JobMarketPressureRatioResponse,
  JobMarketPressureRatioQuery
} from '../models/dashboard.model';
import {
  JobListResponse,
  JobListItemDto,
  JobListingDto,
  JobFreshnessDto
} from '../models/job.model';
import { TechnologyDto } from '../models/technology.model';
import { LocationDto } from '../models/location.model';
import {
  ActiveJobSeekerCountResponse,
  JobSeekerRegistrationResponse,
  JobSeekerStatusUpdateResponse,
  RegisterJobSeekerRequest,
  UpdateJobSeekerStatusRequest
} from '../models/job-seeker.model';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  private readonly technologies: TechnologyDto[] = [
    { id: 'c0100000-0000-0000-0000-000000000001', name: '.NET Core / C#', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000002', name: 'Angular', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000003', name: 'React', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000004', name: 'Python', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000005', name: 'Java / Spring Boot', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000006', name: 'Microsoft Azure', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000007', name: 'AWS', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000008', name: 'SQL Server / PostgreSQL', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000009', name: 'TypeScript', isActive: true },
    { id: 'c0100000-0000-0000-0000-000000000010', name: 'Node.js', isActive: true }
  ];

  private readonly locations: LocationDto[] = [
    { id: 'c0200000-0000-0000-0000-000000000001', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    { id: 'c0200000-0000-0000-0000-000000000002', city: 'Hyderabad', state: 'Telangana', country: 'India' },
    { id: 'c0200000-0000-0000-0000-000000000003', city: 'Pune', state: 'Maharashtra', country: 'India' },
    { id: 'c0200000-0000-0000-0000-000000000004', city: 'Delhi NCR', state: 'Delhi', country: 'India' },
    { id: 'c0200000-0000-0000-0000-000000000005', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 'c0200000-0000-0000-0000-000000000006', city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'c0200000-0000-0000-0000-000000000007', city: 'Kolkata', state: 'West Bengal', country: 'India' }
  ];

  private readonly jobs: JobListingDto[] = [
    {
      id: 'job-00000001',
      title: 'Senior .NET Core & Cloud Architect',
      companyName: 'Infosys Digital Systems',
      jobUrl: 'https://example.com/jobs/infosys-net-architect',
      sourceIdentifier: 'INF-NET-2026-01',
      collectedAtUtc: '2026-10-02T08:30:00Z',
      originalPostedDateUtc: '2026-10-01T10:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salaryMin: 2200000,
      salaryMax: 3200000,
      description: 'Seeking a Senior .NET Core Architect to design and implement mission-critical distributed cloud services. Requirements: C#, .NET 8/10, Azure Microservices, Clean Architecture, Entity Framework Core, Docker, and Kafka.',
      technology: { id: 'c0100000-0000-0000-0000-000000000001', name: '.NET Core / C#' },
      location: { id: 'c0200000-0000-0000-0000-000000000001', city: 'Bengaluru', state: 'Karnataka', country: 'India', region: 'South' },
      experienceRange: '5-8 years',
      source: { id: 'src-1', name: 'Naukri Feed', websiteUrl: 'https://naukri.com' }
    },
    {
      id: 'job-00000002',
      title: 'Lead Frontend Engineer (Angular 22 / TypeScript)',
      companyName: 'Wipro Enterprise Platforms',
      jobUrl: 'https://example.com/jobs/wipro-angular-lead',
      sourceIdentifier: 'WIP-ANG-2026-02',
      collectedAtUtc: '2026-10-02T09:15:00Z',
      originalPostedDateUtc: '2026-09-30T14:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Remote',
      employmentType: 'Full-time',
      salaryMin: 1800000,
      salaryMax: 2600000,
      description: 'Lead modern enterprise web application development with standalone Angular architecture, RxJS signals, Angular Material, SCSS design systems, and responsive performance tuning.',
      technology: { id: 'c0100000-0000-0000-0000-000000000002', name: 'Angular' },
      location: { id: 'c0200000-0000-0000-0000-000000000002', city: 'Hyderabad', state: 'Telangana', country: 'India', region: 'South' },
      experienceRange: '4-8 years',
      source: { id: 'src-2', name: 'LinkedIn India', websiteUrl: 'https://linkedin.com' }
    },
    {
      id: 'job-00000003',
      title: 'Principal Python & Data Platform Engineer',
      companyName: 'TCS Cloud Analytics Labs',
      jobUrl: 'https://example.com/jobs/tcs-python-data',
      sourceIdentifier: 'TCS-PY-2026-03',
      collectedAtUtc: '2026-10-02T07:45:00Z',
      originalPostedDateUtc: '2026-10-01T12:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salaryMin: 2400000,
      salaryMax: 3500000,
      description: 'Architect scalable real-time streaming data pipelines using Python, FastAPI, PySpark, and Delta Lake. Focus on data modeling, schema governance, and cloud telemetry.',
      technology: { id: 'c0100000-0000-0000-0000-000000000004', name: 'Python' },
      location: { id: 'c0200000-0000-0000-0000-000000000003', city: 'Pune', state: 'Maharashtra', country: 'India', region: 'West' },
      experienceRange: '5-8 years',
      source: { id: 'src-1', name: 'Naukri Feed', websiteUrl: 'https://naukri.com' }
    },
    {
      id: 'job-00000004',
      title: 'Full Stack .NET & Angular Developer',
      companyName: 'Tech Mahindra Digital',
      jobUrl: 'https://example.com/jobs/techm-fullstack',
      sourceIdentifier: 'TM-FSD-2026-04',
      collectedAtUtc: '2026-10-01T16:20:00Z',
      originalPostedDateUtc: '2026-09-29T11:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salaryMin: 1200000,
      salaryMax: 1800000,
      description: 'Build robust end-to-end web solutions using ASP.NET Core Web APIs and modern Angular frontend. Requires SQL Server, REST API design, JWT auth, and component testing.',
      technology: { id: 'c0100000-0000-0000-0000-000000000001', name: '.NET Core / C#' },
      location: { id: 'c0200000-0000-0000-0000-000000000001', city: 'Bengaluru', state: 'Karnataka', country: 'India', region: 'South' },
      experienceRange: '2-5 years',
      source: { id: 'src-3', name: 'Foundit Feed', websiteUrl: 'https://foundit.in' }
    },
    {
      id: 'job-00000005',
      title: 'Senior React & Next.js Engineer',
      companyName: 'Cognizant AI Innovations',
      jobUrl: 'https://example.com/jobs/cognizant-react',
      sourceIdentifier: 'COG-RCT-2026-05',
      collectedAtUtc: '2026-10-02T10:10:00Z',
      originalPostedDateUtc: '2026-10-01T09:30:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Remote',
      employmentType: 'Full-time',
      salaryMin: 1600000,
      salaryMax: 2400000,
      description: 'Develop responsive, highly accessible user interfaces for international banking products. Experience with TypeScript, React Hooks, Redux Toolkit, and performance auditing required.',
      technology: { id: 'c0100000-0000-0000-0000-000000000003', name: 'React' },
      location: { id: 'c0200000-0000-0000-0000-000000000004', city: 'Delhi NCR', state: 'Delhi', country: 'India', region: 'North' },
      experienceRange: '4-8 years',
      source: { id: 'src-2', name: 'LinkedIn India', websiteUrl: 'https://linkedin.com' }
    },
    {
      id: 'job-00000006',
      title: 'Cloud DevOps & Infrastructure Engineer',
      companyName: 'Persistent Systems',
      jobUrl: 'https://example.com/jobs/persistent-cloud',
      sourceIdentifier: 'PER-CLD-2026-06',
      collectedAtUtc: '2026-10-01T14:40:00Z',
      originalPostedDateUtc: '2026-09-28T10:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'On-site',
      employmentType: 'Full-time',
      salaryMin: 1400000,
      salaryMax: 2100000,
      description: 'Manage continuous integration pipelines, Kubernetes clusters (AKS/EKS), Terraform IaC, and zero-trust security postures across Azure and multi-cloud environments.',
      technology: { id: 'c0100000-0000-0000-0000-000000000006', name: 'Microsoft Azure' },
      location: { id: 'c0200000-0000-0000-0000-000000000003', city: 'Pune', state: 'Maharashtra', country: 'India', region: 'West' },
      experienceRange: '2-5 years',
      source: { id: 'src-1', name: 'Naukri Feed', websiteUrl: 'https://naukri.com' }
    },
    {
      id: 'job-00000007',
      title: 'Java Spring Boot Microservices Architect',
      companyName: 'LTIMindtree Digital',
      jobUrl: 'https://example.com/jobs/lti-java-microservices',
      sourceIdentifier: 'LTI-JAV-2026-07',
      collectedAtUtc: '2026-10-02T06:50:00Z',
      originalPostedDateUtc: '2026-09-29T15:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salaryMin: 2000000,
      salaryMax: 2900000,
      description: 'Architect and scale event-driven microservices architecture using Java 21, Spring Boot 3, Kafka, PostgreSQL, and OpenTelemetry instrumentation for financial services.',
      technology: { id: 'c0100000-0000-0000-0000-000000000005', name: 'Java / Spring Boot' },
      location: { id: 'c0200000-0000-0000-0000-000000000005', city: 'Mumbai', state: 'Maharashtra', country: 'India', region: 'West' },
      experienceRange: '5-8 years',
      source: { id: 'src-1', name: 'Naukri Feed', websiteUrl: 'https://naukri.com' }
    },
    {
      id: 'job-00000008',
      title: 'Frontend Angular Developer (Junior-Mid)',
      companyName: 'HCLTech Global Labs',
      jobUrl: 'https://example.com/jobs/hcl-angular-dev',
      sourceIdentifier: 'HCL-ANG-2026-08',
      collectedAtUtc: '2026-10-02T11:00:00Z',
      originalPostedDateUtc: '2026-10-02T08:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salaryMin: 700000,
      salaryMax: 1200000,
      description: 'Exciting opportunity for junior to mid-level Angular developers to contribute to customer analytics portals. Hands-on experience with TypeScript, HTML5/SCSS, and Material Design.',
      technology: { id: 'c0100000-0000-0000-0000-000000000002', name: 'Angular' },
      location: { id: 'c0200000-0000-0000-0000-000000000006', city: 'Chennai', state: 'Tamil Nadu', country: 'India', region: 'South' },
      experienceRange: '1-3 years',
      source: { id: 'src-3', name: 'Foundit Feed', websiteUrl: 'https://foundit.in' }
    },
    {
      id: 'job-00000009',
      title: 'Database Architect & Performance Engineer',
      companyName: 'Zensar Technologies',
      jobUrl: 'https://example.com/jobs/zensar-db-architect',
      sourceIdentifier: 'ZEN-SQL-2026-09',
      collectedAtUtc: '2026-10-01T11:25:00Z',
      originalPostedDateUtc: '2026-09-27T14:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      salaryMin: 1900000,
      salaryMax: 2700000,
      description: 'Lead SQL Server high-availability clustering, index optimization, query execution plan tuning, partitioning, and replication strategies for large-scale transaction databases.',
      technology: { id: 'c0100000-0000-0000-0000-000000000008', name: 'SQL Server / PostgreSQL' },
      location: { id: 'c0200000-0000-0000-0000-000000000002', city: 'Hyderabad', state: 'Telangana', country: 'India', region: 'South' },
      experienceRange: '5-8 years',
      source: { id: 'src-1', name: 'Naukri Feed', websiteUrl: 'https://naukri.com' }
    },
    {
      id: 'job-00000010',
      title: 'Full Stack Node.js & React Developer',
      companyName: 'Hexaware Technologies',
      jobUrl: 'https://example.com/jobs/hexaware-fs-node',
      sourceIdentifier: 'HEX-NOD-2026-10',
      collectedAtUtc: '2026-10-02T08:15:00Z',
      originalPostedDateUtc: '2026-10-01T17:00:00Z',
      dataQualityStatus: 'Verified',
      workMode: 'Remote',
      employmentType: 'Full-time',
      salaryMin: 1100000,
      salaryMax: 1700000,
      description: 'Build resilient REST APIs and reactive dashboards. Experience with Node.js, Express/NestJS, MongoDB/PostgreSQL, TypeScript, and modern frontend frameworks.',
      technology: { id: 'c0100000-0000-0000-0000-000000000010', name: 'Node.js' },
      location: { id: 'c0200000-0000-0000-0000-000000000004', city: 'Delhi NCR', state: 'Delhi', country: 'India', region: 'North' },
      experienceRange: '2-5 years',
      source: { id: 'src-2', name: 'LinkedIn India', websiteUrl: 'https://linkedin.com' }
    }
  ];

  getOverview(): DashboardOverviewResponse {
    return {
      activeRegisteredJobSeekers: 7240,
      activeTrackedJobListings: 18450,
      newListingsLast7Days: 2890,
      newListingsLast30Days: 9420,
      topTechnologies: [
        { technologyId: 'c0100000-0000-0000-0000-000000000001', technologyName: '.NET Core / C#', jobCount: 4120 },
        { technologyId: 'c0100000-0000-0000-0000-000000000002', technologyName: 'Angular', jobCount: 3450 },
        { technologyId: 'c0100000-0000-0000-0000-000000000003', technologyName: 'React', jobCount: 3100 },
        { technologyId: 'c0100000-0000-0000-0000-000000000004', technologyName: 'Python', jobCount: 2890 },
        { technologyId: 'c0100000-0000-0000-0000-000000000005', technologyName: 'Java / Spring Boot', jobCount: 2650 },
        { technologyId: 'c0100000-0000-0000-0000-000000000006', technologyName: 'Microsoft Azure', jobCount: 2240 }
      ],
      topLocations: [
        { locationId: 'c0200000-0000-0000-0000-000000000001', city: 'Bengaluru', state: 'Karnataka', jobCount: 6850 },
        { locationId: 'c0200000-0000-0000-0000-000000000002', city: 'Hyderabad', state: 'Telangana', jobCount: 4230 },
        { locationId: 'c0200000-0000-0000-0000-000000000003', city: 'Pune', state: 'Maharashtra', jobCount: 2980 },
        { locationId: 'c0200000-0000-0000-0000-000000000004', city: 'Delhi NCR', state: 'Delhi', jobCount: 2150 },
        { locationId: 'c0200000-0000-0000-0000-000000000005', city: 'Mumbai', state: 'Maharashtra', jobCount: 1420 },
        { locationId: 'c0200000-0000-0000-0000-000000000006', city: 'Chennai', state: 'Tamil Nadu', jobCount: 820 }
      ],
      lastDataUpdate: new Date().toISOString(),
      dataSource: 'sample_platform_demo',
      dataType: 'platform_overview'
    };
  }

  getTrends(): DashboardTrendsResponse {
    return {
      from: '2026-09-02',
      to: '2026-10-02',
      dataSource: 'sample_platform_demo',
      dataType: 'historical_snapshot',
      lastUpdated: new Date().toISOString(),
      data: [
        { snapshotDate: '2026-09-03', activeTrackedJobs: 16200, activeRegisteredJobSeekers: 6100, newJobsLast7Days: 2400, newJobsLast30Days: 8100 },
        { snapshotDate: '2026-09-08', activeTrackedJobs: 16800, activeRegisteredJobSeekers: 6350, newJobsLast7Days: 2550, newJobsLast30Days: 8400 },
        { snapshotDate: '2026-09-13', activeTrackedJobs: 17150, activeRegisteredJobSeekers: 6520, newJobsLast7Days: 2620, newJobsLast30Days: 8650 },
        { snapshotDate: '2026-09-18', activeTrackedJobs: 17500, activeRegisteredJobSeekers: 6710, newJobsLast7Days: 2700, newJobsLast30Days: 8900 },
        { snapshotDate: '2026-09-23', activeTrackedJobs: 17920, activeRegisteredJobSeekers: 6930, newJobsLast7Days: 2780, newJobsLast30Days: 9150 },
        { snapshotDate: '2026-09-28', activeTrackedJobs: 18210, activeRegisteredJobSeekers: 7100, newJobsLast7Days: 2840, newJobsLast30Days: 9310 },
        { snapshotDate: '2026-10-02', activeTrackedJobs: 18450, activeRegisteredJobSeekers: 7240, newJobsLast7Days: 2890, newJobsLast30Days: 9420 }
      ]
    };
  }

  getPressureRatio(query?: JobMarketPressureRatioQuery): JobMarketPressureRatioResponse {
    let seekers = 7240;
    let jobs = 18450;

    if (query?.technologyId) {
      seekers = Math.floor(seekers * 0.28);
      jobs = Math.floor(jobs * 0.24);
    }
    if (query?.locationId) {
      seekers = Math.floor(seekers * 0.35);
      jobs = Math.floor(jobs * 0.38);
    }
    if (query?.experienceRangeId) {
      seekers = Math.floor(seekers * 0.4);
      jobs = Math.floor(jobs * 0.45);
    }

    const calculatedRatio = jobs > 0 ? parseFloat((seekers / jobs).toFixed(2)) : null;

    return {
      ratio: calculatedRatio,
      isAvailable: true,
      sampleSize: {
        activeRegisteredJobSeekers: seekers,
        activeTrackedJobListings: jobs
      },
      filters: {
        technologyId: query?.technologyId || null,
        locationId: query?.locationId || null,
        experienceRangeId: query?.experienceRangeId || null
      },
      metadata: {
        scope: 'Platform Sample Scope (India Tech Intelligence Demo)',
        source: 'JobPulse Voluntary Registrations vs Active Feed Openings',
        methodology: 'Active Registered Candidates / Active Tracked Listings within SLA',
        unavailableReason: null,
        dataSource: 'sample_platform_demo',
        dataType: 'job_market_pressure_ratio'
      },
      dataSource: 'sample_platform_demo',
      dataType: 'job_market_pressure_ratio'
    };
  }

  getJobs(search?: string, tech?: string, loc?: string, exp?: string, pageNumber = 1, pageSize = 10): JobListResponse {
    let filtered = [...this.jobs];

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.technology.name.toLowerCase().includes(q) ||
        j.location.city.toLowerCase().includes(q)
      );
    }

    if (tech && tech.trim()) {
      const t = tech.trim().toLowerCase();
      filtered = filtered.filter(j =>
        j.technology.id.toLowerCase() === t || j.technology.name.toLowerCase().includes(t)
      );
    }

    if (loc && loc.trim()) {
      const l = loc.trim().toLowerCase();
      filtered = filtered.filter(j =>
        j.location.id.toLowerCase() === l || j.location.city.toLowerCase().includes(l)
      );
    }

    if (exp && exp.trim()) {
      const e = exp.trim().toLowerCase();
      filtered = filtered.filter(j => j.experienceRange.toLowerCase().includes(e));
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = (pageNumber - 1) * pageSize;
    const pagedItems = filtered.slice(startIndex, startIndex + pageSize);

    const items: JobListItemDto[] = pagedItems.map(j => ({
      id: j.id,
      title: j.title,
      companyName: j.companyName,
      technology: j.technology.name,
      location: `${j.location.city}${j.location.state ? ', ' + j.location.state : ''}`,
      experienceRange: j.experienceRange,
      source: j.source.name,
      collectedAtUtc: j.collectedAtUtc,
      originalPostedDateUtc: j.originalPostedDateUtc,
      employmentType: j.employmentType,
      workMode: j.workMode,
      jobUrl: j.jobUrl,
      dataQualityStatus: j.dataQualityStatus
    }));

    return {
      items,
      pageNumber,
      pageSize,
      totalCount,
      totalPages
    };
  }

  getJobById(id: string): JobListingDto | null {
    return this.jobs.find(j => j.id === id) || this.jobs[0];
  }

  getJobFreshness(id: string): JobFreshnessDto {
    return {
      jobId: id,
      lastSeenAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      status: 'Fresh'
    };
  }

  getTechnologies(): TechnologyDto[] {
    return [...this.technologies];
  }

  getLocations(): LocationDto[] {
    return [...this.locations];
  }

  getActiveSeekerCount(): ActiveJobSeekerCountResponse {
    return {
      count: 7240,
      lastUpdated: new Date().toISOString(),
      dataType: 'active_candidate_count',
      source: 'voluntary_candidate_registry',
      methodology: 'Active voluntary candidate registrations confirmed within last 90 days',
      dataSource: 'sample_platform_demo'
    };
  }

  registerJobSeeker(_req: RegisterJobSeekerRequest): JobSeekerRegistrationResponse {
    return {
      status: 'Registered',
      registeredAtUtc: new Date().toISOString()
    };
  }

  updateJobSeekerStatus(req: UpdateJobSeekerStatusRequest): JobSeekerStatusUpdateResponse {
    return {
      status: req.status || 'Active',
      lastConfirmedAt: new Date().toISOString()
    };
  }
}
