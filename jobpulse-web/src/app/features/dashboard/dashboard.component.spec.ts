import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';
import { DashboardOverviewResponse, DashboardTrendsResponse } from '../../core/models/dashboard.model';

describe('DashboardComponent', () => {
  let mockDashboardService: {
    getOverview: ReturnType<typeof vi.fn>;
    getTrends: ReturnType<typeof vi.fn>;
    getPressureRatio: ReturnType<typeof vi.fn>;
  };
  let mockTechService: {
    getTechnologies: ReturnType<typeof vi.fn>;
  };
  let mockLocService: {
    getLocations: ReturnType<typeof vi.fn>;
  };

  const sampleOverview: DashboardOverviewResponse = {
    activeTrackedJobListings: 120,
    activeRegisteredJobSeekers: 45,
    newListingsLast7Days: 14,
    newListingsLast30Days: 60,
    topTechnologies: [
      { technologyId: 't1', technologyName: '.NET Core', jobCount: 45 },
      { technologyId: 't2', technologyName: 'Angular', jobCount: 30 }
    ],
    topLocations: [
      { locationId: 'l1', city: 'Bengaluru', state: 'Karnataka', jobCount: 65 },
      { locationId: 'l2', city: 'Hyderabad', state: 'Telangana', jobCount: 35 }
    ],
    lastDataUpdate: '2026-10-02T10:00:00Z',
    dataSource: 'platform_tracked',
    dataType: 'platform_overview'
  };

  const sampleTrends: DashboardTrendsResponse = {
    from: '2026-09-01',
    to: '2026-10-01',
    dataSource: 'platform_snapshots',
    dataType: 'historical_snapshot',
    lastUpdated: '2026-10-02T10:00:00Z',
    data: [
      {
        snapshotDate: '2026-09-01',
        activeTrackedJobs: 100,
        activeRegisteredJobSeekers: 40,
        newJobsLast7Days: 10,
        newJobsLast30Days: 50
      }
    ]
  };

  beforeEach(async () => {
    mockDashboardService = {
      getOverview: vi.fn().mockReturnValue(of(sampleOverview)),
      getTrends: vi.fn().mockReturnValue(of(sampleTrends)),
      getPressureRatio: vi.fn().mockReturnValue(of({
        ratio: 0.375,
        isAvailable: true,
        sampleSize: { activeRegisteredJobSeekers: 45, activeTrackedJobListings: 120 },
        filters: {},
        metadata: { scope: 'overall', source: 'platform_tracked', methodology: 'Seekers / Jobs', dataSource: 'platform_tracked', dataType: 'platform_ratio' },
        dataSource: 'platform_tracked',
        dataType: 'platform_ratio'
      }))
    };
    mockTechService = {
      getTechnologies: vi.fn().mockReturnValue(of([]))
    };
    mockLocService = {
      getLocations: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: TechnologyService, useValue: mockTechService },
        { provide: LocationService, useValue: mockLocService }
      ]
    }).compileComponents();
  });

  it('should create and load overview and trends data on init', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(mockDashboardService.getOverview).toHaveBeenCalled();
    expect(mockDashboardService.getTrends).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
    expect(component.overviewData()).toEqual(sampleOverview);
    expect(component.trendsData()).toEqual(sampleTrends);
  });

  it('should render KPI values and charts section in success state', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('120'); // Active Tracked
    expect(el.textContent).toContain('45');  // Active Registered
    expect(el.querySelector('app-pressure-ratio-card')).toBeTruthy();
  });

  it('should display empty state when tracked jobs and seekers are 0', () => {
    const emptyOverview: DashboardOverviewResponse = {
      ...sampleOverview,
      activeTrackedJobListings: 0,
      activeRegisteredJobSeekers: 0,
      topTechnologies: [],
      topLocations: []
    };
    mockDashboardService.getOverview.mockReturnValue(of(emptyOverview));

    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should display error state and support retry when API fails', () => {
    mockDashboardService.getOverview.mockReturnValue(
      throwError(() => ({ message: 'Backend timeout', status: 504 }))
    );

    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-error-state')).toBeTruthy();

    // Now test retry
    mockDashboardService.getOverview.mockReturnValue(of(sampleOverview));
    component.loadAll();
    expect(component.error()).toBeNull();
    expect(component.overviewData()).toEqual(sampleOverview);
  });
});
