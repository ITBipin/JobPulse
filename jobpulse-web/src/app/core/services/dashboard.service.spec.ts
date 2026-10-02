import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { DashboardOverviewResponse, DashboardTrendsResponse, JobMarketPressureRatioResponse } from '../models/dashboard.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DashboardService
      ]
    });
    service = TestBed.inject(DashboardService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch dashboard overview', () => {
    const mockOverview: DashboardOverviewResponse = {
      activeRegisteredJobSeekers: 15,
      activeTrackedJobListings: 42,
      newListingsLast7Days: 8,
      newListingsLast30Days: 25,
      topTechnologies: [{ technologyId: 't1', technologyName: 'C#', jobCount: 12 }],
      topLocations: [{ locationId: 'l1', city: 'Bengaluru', state: 'Karnataka', jobCount: 18 }],
      lastDataUpdate: '2026-10-02T10:00:00Z',
      dataSource: 'platform_tracked',
      dataType: 'platform_overview'
    };

    service.getOverview().subscribe(response => {
      expect(response).toEqual(mockOverview);
    });

    const req = httpTesting.expectOne('/api/v1/dashboard/overview');
    expect(req.request.method).toBe('GET');
    req.flush(mockOverview);
  });

  it('should fetch dashboard trends with date range query', () => {
    const mockTrends: DashboardTrendsResponse = {
      from: '2026-09-01',
      to: '2026-10-01',
      dataSource: 'platform_snapshots',
      dataType: 'historical_snapshot',
      lastUpdated: '2026-10-02T00:00:00Z',
      data: [
        {
          snapshotDate: '2026-09-01',
          activeTrackedJobs: 30,
          activeRegisteredJobSeekers: 10,
          newJobsLast7Days: 5,
          newJobsLast30Days: 20
        }
      ]
    };

    service.getTrends({ from: '2026-09-01', to: '2026-10-01' }).subscribe(response => {
      expect(response.data.length).toBe(1);
    });

    const req = httpTesting.expectOne(r => r.url === '/api/v1/dashboard/trends');
    expect(req.request.params.get('from')).toBe('2026-09-01');
    expect(req.request.params.get('to')).toBe('2026-10-01');
    req.flush(mockTrends);
  });

  it('should fetch market pressure ratio with filter parameters', () => {
    const mockRatio: JobMarketPressureRatioResponse = {
      ratio: 0.357,
      isAvailable: true,
      sampleSize: {
        activeRegisteredJobSeekers: 15,
        activeTrackedJobListings: 42
      },
      filters: {
        technologyId: 't-123',
        locationId: 'l-456',
        experienceRangeId: 'e-789'
      },
      metadata: {
        scope: 'filtered',
        source: 'platform_tracked',
        methodology: 'Active Registered Job Seekers / Active Tracked Job Listings',
        dataSource: 'platform_tracked',
        dataType: 'platform_ratio'
      },
      dataSource: 'platform_tracked',
      dataType: 'platform_ratio'
    };

    service.getPressureRatio({
      technologyId: 't-123',
      locationId: 'l-456',
      experienceRangeId: 'e-789'
    }).subscribe(response => {
      expect(response.ratio).toBe(0.357);
      expect(response.isAvailable).toBe(true);
    });

    const req = httpTesting.expectOne(r => r.url === '/api/v1/dashboard/pressure-ratio');
    expect(req.request.params.get('technologyId')).toBe('t-123');
    expect(req.request.params.get('locationId')).toBe('l-456');
    expect(req.request.params.get('experienceRangeId')).toBe('e-789');
    req.flush(mockRatio);
  });

  it('should omit query parameters when filters are not provided or Guid.Empty', () => {
    service.getPressureRatio({
      technologyId: '00000000-0000-0000-0000-000000000000',
      locationId: undefined,
      experienceRangeId: ''
    }).subscribe();

    const req = httpTesting.expectOne('/api/v1/dashboard/pressure-ratio');
    expect(req.request.params.has('technologyId')).toBe(false);
    expect(req.request.params.has('locationId')).toBe(false);
    expect(req.request.params.has('experienceRangeId')).toBe(false);
    req.flush({} as any);
  });
});
