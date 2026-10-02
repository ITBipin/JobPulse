import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError, Subject } from 'rxjs';
import { JobSeekersComponent } from './job-seekers.component';
import { JobSeekerService } from '../../core/services/job-seeker.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';
import { ExperienceRangeService } from '../../core/services/experience-range.service';
import { JobSeekerRegistrationResponse, JobSeekerStatusUpdateResponse } from '../../core/models/job-seeker.model';

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
  let mockExpService: {
    getExperienceRanges: ReturnType<typeof vi.fn>;
  };

  const VALID_GUID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

  beforeEach(async () => {
    mockSeekerService = {
      getActiveCount: vi.fn().mockReturnValue(of({
        count: 52,
        lastUpdated: '2026-10-02T10:00:00Z',
        dataType: 'registered_count',
        source: 'JobPulse Platform',
        methodology: 'Platform registered candidates',
        dataSource: 'platform_registered'
      })),
      register: vi.fn().mockReturnValue(of({ status: 'Registered', registeredAtUtc: '2026-10-02T10:00:00Z' })),
      updateStatus: vi.fn().mockReturnValue(of({ status: 'Hired', lastConfirmedAt: '2026-10-02T10:00:00Z' }))
    };
    mockTechService = {
      getTechnologies: vi.fn().mockReturnValue(of([{ id: 'tech-1', name: '.NET', isActive: true }]))
    };
    mockLocService = {
      getLocations: vi.fn().mockReturnValue(of([{ id: 'loc-1', city: 'Bengaluru', country: 'India' }]))
    };
    mockExpService = {
      getExperienceRanges: vi.fn().mockReturnValue(of([
        { id: '1-3-years', label: '1-3 years' },
        { id: '2-5-years', label: '2-5 years' }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [JobSeekersComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: JobSeekerService, useValue: mockSeekerService },
        { provide: TechnologyService, useValue: mockTechService },
        { provide: LocationService, useValue: mockLocService },
        { provide: ExperienceRangeService, useValue: mockExpService }
      ]
    }).compileComponents();
  });

  describe('Initialization & Metadata', () => {
    it('should initialize and load active seeker count, technologies, locations, and experience tiers', () => {
      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
      expect(mockSeekerService.getActiveCount).toHaveBeenCalled();
      expect(component.activeCountData()?.count).toBe(52);
      expect(component.technologies().length).toBe(1);
      expect(component.locations().length).toBe(1);
      expect(mockExpService.getExperienceRanges).toHaveBeenCalled();
      expect(component.experienceTiers().length).toBe(2);
    });
  });

  describe('Voluntary Registration', () => {
    it('should require mandatory fields and explicit consent', () => {
      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.registerForm.valid).toBe(false);

      // Partially fill - missing consent
      component.registerForm.patchValue({
        locationId: 'loc-1',
        experienceRangeId: '1-3-years',
        technologyIds: ['tech-1'],
        jobSearchStatus: 'OpenToWork',
        consent: false
      });
      expect(component.registerForm.valid).toBe(false);
      expect(component.registerForm.get('consent')?.hasError('required')).toBe(true);

      // Missing technologyIds
      component.registerForm.patchValue({
        technologyIds: [],
        consent: true
      });
      expect(component.registerForm.valid).toBe(false);

      // Valid with all required fields
      component.registerForm.patchValue({
        technologyIds: ['tech-1'],
        consent: true
      });
      expect(component.registerForm.valid).toBe(true);
    });

    it('should submit registration and show success state with privacy compliance', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.registerForm.patchValue({
        locationId: 'loc-1',
        experienceRangeId: '1-3-years',
        technologyIds: ['tech-1'],
        jobSearchStatus: 'OpenToWork',
        consent: true
      });

      component.submitRegistration();

      expect(mockSeekerService.register).toHaveBeenCalledWith({
        locationId: 'loc-1',
        experienceRangeId: '1-3-years',
        technologyIds: ['tech-1'],
        jobSearchStatus: 'OpenToWork',
        jobSearchStartDate: null,
        salaryMin: null,
        salaryMax: null,
        consent: true
      });

      expect(component.registrationSuccess()).toBe(true);
      expect(component.registrationResult()?.status).toBe('Registered');
      expect((component.registrationResult() as any)?.id).toBeUndefined();
      expect(setItemSpy).not.toHaveBeenCalled();

      setItemSpy.mockRestore();
    });

    it('should track isSubmitting loading state during registration', () => {
      const subject = new Subject<JobSeekerRegistrationResponse>();
      mockSeekerService.register.mockReturnValue(subject.asObservable());

      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.registerForm.patchValue({
        locationId: 'loc-1',
        experienceRangeId: '1-3-years',
        technologyIds: ['tech-1'],
        jobSearchStatus: 'OpenToWork',
        consent: true
      });

      expect(component.isSubmitting()).toBe(false);
      component.submitRegistration();
      expect(component.isSubmitting()).toBe(true);

      subject.next({ status: 'Registered', registeredAtUtc: '2026-10-02T10:00:00Z' });
      subject.complete();

      expect(component.isSubmitting()).toBe(false);
      expect(component.registrationSuccess()).toBe(true);
    });

    it('should display error message on registration failure', () => {
      mockSeekerService.register.mockReturnValue(throwError(() => ({ message: 'Invalid selections', status: 400 })));

      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.registerForm.patchValue({
        locationId: 'loc-1',
        experienceRangeId: '1-3-years',
        technologyIds: ['tech-1'],
        jobSearchStatus: 'OpenToWork',
        consent: true
      });

      component.submitRegistration();

      expect(component.registrationSuccess()).toBe(false);
      expect(component.submitError()).toBe('Invalid selections');
      expect(component.isSubmitting()).toBe(false);
    });

    it('should reset registration form back to default state', () => {
      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.registerForm.patchValue({
        locationId: 'loc-1',
        experienceRangeId: '1-3-years',
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

  describe('Existing Candidate Status Update', () => {
    it('should validate GUID format and require non-empty GUID', () => {
      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      expect(component.statusForm.valid).toBe(false);

      // Invalid GUID string
      component.statusForm.patchValue({
        jobSeekerId: 'not-a-valid-guid',
        status: 'OpenToWork'
      });
      expect(component.statusForm.valid).toBe(false);
      expect(component.statusForm.get('jobSeekerId')?.hasError('pattern')).toBe(true);

      // Arbitrary non-guid ID
      component.statusForm.patchValue({
        jobSeekerId: '12345',
        status: 'OpenToWork'
      });
      expect(component.statusForm.valid).toBe(false);
      expect(component.statusForm.get('jobSeekerId')?.hasError('pattern')).toBe(true);

      // Valid GUID
      component.statusForm.patchValue({
        jobSeekerId: VALID_GUID,
        status: 'OpenToWork'
      });
      expect(component.statusForm.valid).toBe(true);
    });

    it('should update candidate status when valid GUID is provided', () => {
      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.statusForm.patchValue({
        jobSeekerId: VALID_GUID,
        status: 'Hired'
      });

      component.submitStatusUpdate();

      expect(mockSeekerService.updateStatus).toHaveBeenCalledWith({
        jobSeekerId: VALID_GUID,
        status: 'Hired'
      });
      expect(component.statusUpdateSuccess()).toBe(true);
      expect(component.statusUpdateResult()?.status).toBe('Hired');
    });

    it('should track isUpdatingStatus loading state during status update', () => {
      const subject = new Subject<JobSeekerStatusUpdateResponse>();
      mockSeekerService.updateStatus.mockReturnValue(subject.asObservable());

      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.statusForm.patchValue({
        jobSeekerId: VALID_GUID,
        status: 'Hired'
      });

      expect(component.isUpdatingStatus()).toBe(false);
      component.submitStatusUpdate();
      expect(component.isUpdatingStatus()).toBe(true);

      subject.next({ status: 'Hired', lastConfirmedAt: '2026-10-02T10:00:00Z' });
      subject.complete();

      expect(component.isUpdatingStatus()).toBe(false);
      expect(component.statusUpdateSuccess()).toBe(true);
    });

    it('should handle status update API error cleanly', () => {
      mockSeekerService.updateStatus.mockReturnValue(
        throwError(() => ({ message: 'Candidate not found.', detail: 'No candidate exists with this ID.' }))
      );

      const fixture = TestBed.createComponent(JobSeekersComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.statusForm.patchValue({
        jobSeekerId: VALID_GUID,
        status: 'NotLooking'
      });

      component.submitStatusUpdate();

      expect(component.statusUpdateSuccess()).toBe(false);
      expect(component.statusError()).toBe('No candidate exists with this ID.');
      expect(component.isUpdatingStatus()).toBe(false);
    });
  });
});
