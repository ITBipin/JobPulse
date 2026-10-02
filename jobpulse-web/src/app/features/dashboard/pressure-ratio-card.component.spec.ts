import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';
import { PressureRatioCardComponent } from './pressure-ratio-card.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';
import { JobMarketPressureRatioResponse } from '../../core/models/dashboard.model';

describe('PressureRatioCardComponent', () => {
  let mockDashboardService: {
    getPressureRatio: ReturnType<typeof vi.fn>;
  };
  let mockTechService: {
    getTechnologies: ReturnType<typeof vi.fn>;
  };
  let mockLocService: {
    getLocations: ReturnType<typeof vi.fn>;
  };

  const sampleRatio: JobMarketPressureRatioResponse = {
    ratio: 0.42,
    isAvailable: true,
    sampleSize: {
      activeRegisteredJobSeekers: 42,
      activeTrackedJobListings: 100
    },
    filters: {
      technologyId: null,
      locationId: null,
      experienceRangeId: null
    },
    metadata: {
      scope: 'overall',
      source: 'platform_tracked',
      methodology: 'Active Registered Seekers / Active Tracked Openings',
      dataSource: 'platform_tracked',
      dataType: 'platform_ratio'
    },
    dataSource: 'platform_tracked',
    dataType: 'platform_ratio'
  };

  beforeEach(async () => {
    mockDashboardService = {
      getPressureRatio: vi.fn().mockReturnValue(of(sampleRatio))
    };
    mockTechService = {
      getTechnologies: vi.fn().mockReturnValue(of([{ id: 'tech-1', name: '.NET', isActive: true }]))
    };
    mockLocService = {
      getLocations: vi.fn().mockReturnValue(of([{ id: 'loc-1', city: 'Bengaluru', country: 'India' }]))
    };

    await TestBed.configureTestingModule({
      imports: [PressureRatioCardComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: TechnologyService, useValue: mockTechService },
        { provide: LocationService, useValue: mockLocService }
      ]
    }).compileComponents();
  });

  it('should create and load ratio and filter options', () => {
    const fixture = TestBed.createComponent(PressureRatioCardComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(mockDashboardService.getPressureRatio).toHaveBeenCalled();
    expect(component.ratioData()).toEqual(sampleRatio);
    expect(component.techOptions().length).toBe(1);
    expect(component.locOptions().length).toBe(1);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('0.42');
    expect(el.textContent).toContain('100'); // Tracked Openings
    expect(el.textContent).toContain('42');  // Active Seekers
  });

  it('should update query when technology filter is changed', () => {
    const fixture = TestBed.createComponent(PressureRatioCardComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.onTechChange('tech-1');

    expect(component.selectedTechId()).toBe('tech-1');
    expect(mockDashboardService.getPressureRatio).toHaveBeenCalledWith({ technologyId: 'tech-1' });
  });

  it('should reset filters when resetFilters is called', () => {
    const fixture = TestBed.createComponent(PressureRatioCardComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.onTechChange('tech-1');
    component.resetFilters();

    expect(component.selectedTechId()).toBeNull();
    expect(component.selectedLocId()).toBeNull();
  });

  it('should display unavailable state cleanly when ratio is unavailable', () => {
    const unavailRatio: JobMarketPressureRatioResponse = {
      ...sampleRatio,
      ratio: null,
      isAvailable: false,
      metadata: {
        ...sampleRatio.metadata,
        unavailableReason: 'No active tracked jobs found matching the selected filters.'
      }
    };
    mockDashboardService.getPressureRatio.mockReturnValue(of(unavailRatio));

    const fixture = TestBed.createComponent(PressureRatioCardComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Unavailable');
    expect(el.textContent).toContain('No active tracked jobs found');
  });

  it('should display error notice and allow retry when ratio API fails', () => {
    mockDashboardService.getPressureRatio.mockReturnValue(throwError(() => ({ message: 'Failed to compute ratio.' })));

    const fixture = TestBed.createComponent(PressureRatioCardComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.error()).toBe('Failed to compute ratio.');
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Failed to compute ratio.');

    mockDashboardService.getPressureRatio.mockReturnValue(of(sampleRatio));
    component.loadRatio();
    fixture.detectChanges();
    expect(component.error()).toBeNull();
    expect(component.ratioData()).toEqual(sampleRatio);
  });
});
