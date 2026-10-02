import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { JobSeekerService } from './job-seeker.service';
import {
  ActiveJobSeekerCountResponse,
  JobSeekerRegistrationResponse,
  JobSeekerStatusUpdateResponse,
  RegisterJobSeekerRequest,
  UpdateJobSeekerStatusRequest
} from '../models/job-seeker.model';

describe('JobSeekerService', () => {
  let service: JobSeekerService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        JobSeekerService
      ]
    });
    service = TestBed.inject(JobSeekerService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch active job seeker count', () => {
    const mockCount: ActiveJobSeekerCountResponse = {
      count: 24,
      lastUpdated: '2026-10-02T10:00:00Z',
      dataType: 'platform_registered',
      source: 'JobPulse platform registrations',
      methodology: 'Counts registered seekers with OpenToWork status',
      dataSource: 'platform_registered'
    };

    service.getActiveCount().subscribe(res => {
      expect(res.count).toBe(24);
      expect(res.dataSource).toBe('platform_registered');
    });

    const req = httpTesting.expectOne('/api/v1/job-seekers/active-count');
    expect(req.request.method).toBe('GET');
    req.flush(mockCount);
  });

  it('should post registration request', () => {
    const request: RegisterJobSeekerRequest = {
      experienceRangeId: 'e-1',
      locationId: 'l-1',
      technologyIds: ['t-1'],
      jobSearchStatus: 'OpenToWork',
      consent: true
    };

    const mockResponse: JobSeekerRegistrationResponse = {
      status: 'Created',
      registeredAtUtc: '2026-10-02T10:00:00Z'
    };

    service.register(request).subscribe(res => {
      expect(res.status).toBe('Created');
    });

    const req = httpTesting.expectOne('/api/v1/job-seekers/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should update seeker status', () => {
    const request: UpdateJobSeekerStatusRequest = {
      jobSeekerId: 'js-1',
      status: 'OpenToWork'
    };

    const mockResponse: JobSeekerStatusUpdateResponse = {
      status: 'OpenToWork',
      lastConfirmedAt: '2026-10-02T10:00:00Z'
    };

    service.updateStatus(request).subscribe(res => {
      expect(res.status).toBe('OpenToWork');
    });

    const req = httpTesting.expectOne('/api/v1/job-seekers/status');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });
});
