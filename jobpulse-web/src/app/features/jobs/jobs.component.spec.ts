import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';
import { JobsComponent } from './jobs.component';
import { JobService } from '../../core/services/job.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';
import { JobListResponse } from '../../core/models/job.model';

describe('JobsComponent', () => {
  let mockJobService: {
    getJobs: ReturnType<typeof vi.fn>;
  };
  let mockTechService: {
    getTechnologies: ReturnType<typeof vi.fn>;
  };
  let mockLocService: {
    getLocations: ReturnType<typeof vi.fn>;
  };

  const sampleListResponse: JobListResponse = {
    items: [
      {
        id: 'job-1',
        title: 'Lead .NET Core Engineer',
        companyName: 'FinTech Solutions',
        technology: '.NET Core',
        location: 'Bengaluru',
        experienceRange: '5-8 years',
        source: 'LinkedIn',
        collectedAtUtc: '2026-10-02T10:00:00Z',
        dataQualityStatus: 'Valid'
      }
    ],
    pageNumber: 1,
    pageSize: 20,
    totalCount: 1,
    totalPages: 1
  };

  beforeEach(async () => {
    mockJobService = {
      getJobs: vi.fn().mockReturnValue(of(sampleListResponse))
    };
    mockTechService = {
      getTechnologies: vi.fn().mockReturnValue(of([{ id: 'tech-1', name: '.NET Core', isActive: true }]))
    };
    mockLocService = {
      getLocations: vi.fn().mockReturnValue(of([{ id: 'loc-1', city: 'Bengaluru', country: 'India' }]))
    };

    await TestBed.configureTestingModule({
      imports: [JobsComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: JobService, useValue: mockJobService },
        { provide: TechnologyService, useValue: mockTechService },
        { provide: LocationService, useValue: mockLocService }
      ]
    }).compileComponents();
  });

  it('should initialize and load jobs with default page parameters', () => {
    const fixture = TestBed.createComponent(JobsComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(mockJobService.getJobs).toHaveBeenCalled();
    expect(component.jobsData()).toEqual(sampleListResponse);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Lead .NET Core Engineer');
    expect(el.textContent).toContain('FinTech Solutions');
  });

  it('should apply search keyword filter', () => {
    const fixture = TestBed.createComponent(JobsComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.searchQuery = 'Senior Architect';
    component.applyFilters();

    expect(component.currentPage()).toBe(1);
    expect(mockJobService.getJobs).toHaveBeenCalled();
  });

  it('should reset filters and reload', () => {
    const fixture = TestBed.createComponent(JobsComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.searchQuery = 'Architect';
    component.selectedTechnology.set('.NET Core');
    component.resetAllFilters();

    expect(component.searchQuery).toBe('');
    expect(component.selectedTechnology()).toBeNull();
  });

  it('should display empty state when results list is empty', () => {
    mockJobService.getJobs.mockReturnValue(of({
      items: [],
      pageNumber: 1,
      pageSize: 20,
      totalCount: 0,
      totalPages: 0
    }));

    const fixture = TestBed.createComponent(JobsComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should display error state when API fails', () => {
    mockJobService.getJobs.mockReturnValue(throwError(() => ({ message: 'Gateway timeout', status: 504 })));

    const fixture = TestBed.createComponent(JobsComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-error-state')).toBeTruthy();
  });

  it('should update page and page size when onPageChange is called', () => {
    const fixture = TestBed.createComponent(JobsComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.onPageChange({ pageIndex: 2, pageSize: 50, length: 150 });

    expect(component.currentPage()).toBe(3);
    expect(component.pageSize()).toBe(50);
  });

  it('should filter by technology and location when selected', () => {
    const fixture = TestBed.createComponent(JobsComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.onTechSelected('.NET Core');
    expect(component.selectedTechnology()).toBe('.NET Core');

    component.onLocationSelected('Bengaluru');
    expect(component.selectedLocation()).toBe('Bengaluru');

    expect(component.hasActiveFilters()).toBe(true);
  });
});
