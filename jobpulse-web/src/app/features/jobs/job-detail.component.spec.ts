import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JobDetailComponent } from './job-detail.component';
import { JobService } from '../../core/services/job.service';
import { JobFreshnessDto, JobListingDto } from '../../core/models/job.model';

describe('JobDetailComponent', () => {
  let mockJobService: {
    getJobById: ReturnType<typeof vi.fn>;
    getFreshness: ReturnType<typeof vi.fn>;
  };

  const sampleJob: JobListingDto = {
    id: 'job-123',
    title: 'Senior Systems Architect',
    companyName: 'CloudScale Technologies',
    collectedAtUtc: '2026-10-02T10:00:00Z',
    dataQualityStatus: 'Valid',
    experienceRange: '8-12 years',
    technology: { id: 'tech-1', name: 'Azure Cloud' },
    location: { id: 'loc-1', city: 'Hyderabad', state: 'Telangana', country: 'India' },
    source: { id: 'src-1', name: 'Naukri' },
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    description: 'Lead enterprise architecture transformations.'
  };

  const sampleFreshness: JobFreshnessDto = {
    jobId: 'job-123',
    lastSeenAt: '2026-10-02T10:00:00Z',
    status: 'Fresh'
  };

  beforeEach(async () => {
    mockJobService = {
      getJobById: vi.fn().mockReturnValue(of(sampleJob)),
      getFreshness: vi.fn().mockReturnValue(of(sampleFreshness))
    };

    await TestBed.configureTestingModule({
      imports: [JobDetailComponent],
      providers: [
        provideRouter([]),
        { provide: JobService, useValue: mockJobService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', 'job-123']])),
            snapshot: { paramMap: new Map([['id', 'job-123']]) }
          }
        }
      ]
    }).compileComponents();
  });

  it('should load and render job details and freshness', () => {
    const fixture = TestBed.createComponent(JobDetailComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(mockJobService.getJobById).toHaveBeenCalledWith('job-123');
    expect(mockJobService.getFreshness).toHaveBeenCalledWith('job-123');

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Senior Systems Architect');
    expect(el.textContent).toContain('CloudScale Technologies');
    expect(el.textContent).toContain('Fresh');
    expect(el.textContent).toContain('Azure Cloud');
  });

  it('should display not found empty state when job returns 404', () => {
    mockJobService.getJobById.mockReturnValue(throwError(() => ({ status: 404, message: 'Not found' })));

    const fixture = TestBed.createComponent(JobDetailComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-empty-state')).toBeTruthy();
    expect(el.textContent).toContain('Job Listing Not Found');
  });

  it('should display error state when backend service fails with 500', () => {
    mockJobService.getJobById.mockReturnValue(throwError(() => ({ status: 500, message: 'Server error' })));

    const fixture = TestBed.createComponent(JobDetailComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-error-state')).toBeTruthy();
  });

  it('should navigate to /jobs via router when navigateJobs is called', () => {
    const fixture = TestBed.createComponent(JobDetailComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const navSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.navigateJobs();
    expect(navSpy).toHaveBeenCalledWith(['/jobs']);
  });
});
