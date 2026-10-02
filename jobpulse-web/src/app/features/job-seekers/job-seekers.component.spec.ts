import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';
import { JobSeekersComponent } from './job-seekers.component';
import { JobSeekerService } from '../../core/services/job-seeker.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';

describe('JobSeekersComponent', () => {
  let mockSeekerService: {
    getActiveCount: ReturnType<typeof vi.fn>;
    register: ReturnType<typeof vi.fn>;
    updateStatus: ReturnType<typeof vi.fn>;
  };
  let mockTechService: {
    getTechnologies: ReturnType<typeof vi.fn>;
  };
  let mockLocService: {
    getLocations: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockSeekerService = {
      getActiveCount: vi.fn().mockReturnValue(of({ count: 52, lastUpdated: '2026-10-02T10:00:00Z', dataSource: 'platform_registered' })),
      register: vi.fn().mockReturnValue(of({ status: 'Registered', registeredAtUtc: '2026-10-02T10:00:00Z' })),
      updateStatus: vi.fn().mockReturnValue(of({ status: 'Hired', lastConfirmedAt: '2026-10-02T10:00:00Z' }))
    };
    mockTechService = {
      getTechnologies: vi.fn().mockReturnValue(of([{ id: 'tech-1', name: '.NET', isActive: true }]))
    };
    mockLocService = {
      getLocations: vi.fn().mockReturnValue(of([{ id: 'loc-1', city: 'Bengaluru', country: 'India' }]))
    };

    await TestBed.configureTestingModule({
      imports: [JobSeekersComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: JobSeekerService, useValue: mockSeekerService },
        { provide: TechnologyService, useValue: mockTechService },
        { provide: LocationService, useValue: mockLocService }
      ]
    }).compileComponents();
  });

  it('should initialize and load active seeker count and options', () => {
    const fixture = TestBed.createComponent(JobSeekersComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(mockSeekerService.getActiveCount).toHaveBeenCalled();
    expect(component.activeCountData()?.count).toBe(52);
    expect(component.technologies().length).toBe(1);
    expect(component.locations().length).toBe(1);
  });

  it('should require consent and mandatory fields for registration', () => {
    const fixture = TestBed.createComponent(JobSeekersComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.registerForm.valid).toBe(false);

    component.registerForm.patchValue({
      locationId: 'loc-1',
      experienceRangeId: 'tier-1',
      technologyIds: ['tech-1'],
      jobSearchStatus: 'OpenToWork',
      consent: false
    });
    expect(component.registerForm.valid).toBe(false); // consent is false

    component.registerForm.patchValue({ consent: true });
    expect(component.registerForm.valid).toBe(true);
  });

  it('should submit registration and show success state', () => {
    const fixture = TestBed.createComponent(JobSeekersComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.registerForm.patchValue({
      locationId: 'loc-1',
      experienceRangeId: 'tier-1',
      technologyIds: ['tech-1'],
      jobSearchStatus: 'OpenToWork',
      consent: true
    });

    component.submitRegistration();

    expect(mockSeekerService.register).toHaveBeenCalled();
    expect(component.registrationSuccess()).toBe(true);
    expect(component.registrationResult()?.status).toBe('Registered');
  });

  it('should display error message on registration failure', () => {
    mockSeekerService.register.mockReturnValue(throwError(() => ({ message: 'Invalid selections', status: 400 })));

    const fixture = TestBed.createComponent(JobSeekersComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.registerForm.patchValue({
      locationId: 'loc-1',
      experienceRangeId: 'tier-1',
      technologyIds: ['tech-1'],
      jobSearchStatus: 'OpenToWork',
      consent: true
    });

    component.submitRegistration();

    expect(component.registrationSuccess()).toBe(false);
    expect(component.submitError()).toBe('Invalid selections');
  });

  it('should update candidate status when valid ID provided', () => {
    const fixture = TestBed.createComponent(JobSeekersComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.statusForm.patchValue({
      jobSeekerId: 'js-12345',
      status: 'Hired'
    });

    component.submitStatusUpdate();

    expect(mockSeekerService.updateStatus).toHaveBeenCalledWith({
      jobSeekerId: 'js-12345',
      status: 'Hired'
    });
    expect(component.statusUpdateSuccess()).toBe(true);
  });

  it('should handle status update API error cleanly', () => {
    mockSeekerService.updateStatus.mockReturnValue(throwError(() => ({ message: 'Candidate not found.', detail: 'No candidate exists with this ID.' })));

    const fixture = TestBed.createComponent(JobSeekersComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.statusForm.patchValue({
      jobSeekerId: 'js-99999',
      status: 'NotLooking'
    });

    component.submitStatusUpdate();

    expect(component.statusUpdateSuccess()).toBe(false);
    expect(component.statusError()).toBe('No candidate exists with this ID.');
  });

  it('should reset registration form back to default state', () => {
    const fixture = TestBed.createComponent(JobSeekersComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.registerForm.patchValue({
      locationId: 'loc-1',
      experienceRangeId: 'tier-1',
      technologyIds: ['tech-1'],
      jobSearchStatus: 'OpenToWork',
      consent: true
    });
    component.registrationSuccess.set(true);

    component.resetRegistrationForm();

    expect(component.registrationSuccess()).toBe(false);
    expect(component.registerForm.get('locationId')?.value).toBe('');
    expect(component.registerForm.get('consent')?.value).toBe(false);
  });
});
