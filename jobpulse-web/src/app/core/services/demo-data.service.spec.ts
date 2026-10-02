import { TestBed } from '@angular/core/testing';
import { DemoDataService } from './demo-data.service';

describe('DemoDataService', () => {
  let service: DemoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoDataService]
    });
    service = TestBed.inject(DemoDataService);
  });

  it('should return valid dashboard overview with sample branding', () => {
    const overview = service.getOverview();
    expect(overview).toBeDefined();
    expect(overview.activeRegisteredJobSeekers).toBeGreaterThan(0);
    expect(overview.activeTrackedJobListings).toBeGreaterThan(0);
    expect(overview.topTechnologies.length).toBeGreaterThan(0);
    expect(overview.topLocations.length).toBeGreaterThan(0);
    expect(overview.dataSource).toBe('sample_platform_demo');
  });

  it('should return valid trends snapshot points', () => {
    const trends = service.getTrends();
    expect(trends.data.length).toBeGreaterThan(0);
    expect(trends.data[0].activeTrackedJobs).toBeGreaterThan(0);
  });

  it('should calculate pressure ratio with and without filters', () => {
    const defaultRatio = service.getPressureRatio();
    expect(defaultRatio.isAvailable).toBe(true);
    expect(defaultRatio.ratio).toBeGreaterThan(0);

    const filteredRatio = service.getPressureRatio({
      technologyId: 'c0100000-0000-0000-0000-000000000001',
      locationId: 'c0200000-0000-0000-0000-000000000001'
    });
    expect(filteredRatio.isAvailable).toBe(true);
    expect(filteredRatio.filters.technologyId).toBe('c0100000-0000-0000-0000-000000000001');
  });

  it('should return jobs with filtering and pagination', () => {
    const result = service.getJobs();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.totalCount).toBeGreaterThan(0);

    const searchResult = service.getJobs('Angular');
    expect(searchResult.items.every(j =>
      j.title.includes('Angular') || j.technology.includes('Angular')
    )).toBe(true);
  });

  it('should return job detail and freshness', () => {
    const job = service.getJobById('job-00000001');
    expect(job).toBeDefined();
    expect(job?.title).toContain('.NET');

    const freshness = service.getJobFreshness('job-00000001');
    expect(freshness.status).toBe('Fresh');
    expect(freshness.jobId).toBe('job-00000001');
  });

  it('should support job seeker voluntary registration and status update', () => {
    const regResult = service.registerJobSeeker({
      consent: true,
      experienceRangeId: '2-5-years',
      jobSearchStatus: 'OpenToWork',
      locationId: 'c0200000-0000-0000-0000-000000000001',
      technologyIds: ['c0100000-0000-0000-0000-000000000001']
    });
    expect(regResult.status).toBe('Registered');
    expect(regResult.registeredAtUtc).toBeDefined();

    const updateResult = service.updateJobSeekerStatus({
      jobSeekerId: 'js-1',
      status: 'Hired'
    });
    expect(updateResult.status).toBe('Hired');
  });
});
