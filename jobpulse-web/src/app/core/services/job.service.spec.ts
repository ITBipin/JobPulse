import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { JobService } from './job.service';
import { JobFreshnessDto, JobListingDto, JobListingImportSummary, JobListResponse } from '../models/job.model';

describe('JobService', () => {
  let service: JobService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        JobService
      ]
    });
    service = TestBed.inject(JobService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch jobs with query parameters', () => {
    const mockResponse: JobListResponse = {
      items: [
        {
          id: 'job-1',
          title: 'Senior .NET Developer',
          companyName: 'TechCorp',
          technology: '.NET',
          location: 'Bengaluru',
          experienceRange: '3-5 years',
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

    service.getJobs({ search: '.NET', pageNumber: 1, pageSize: 20 }).subscribe(res => {
      expect(res.items.length).toBe(1);
      expect(res.totalCount).toBe(1);
    });

    const req = httpTesting.expectOne(r => r.url === '/api/v1/jobs');
    expect(req.request.params.get('search')).toBe('.NET');
    expect(req.request.params.get('pageNumber')).toBe('1');
    expect(req.request.params.get('pageSize')).toBe('20');
    req.flush(mockResponse);
  });

  it('should fetch job by ID', () => {
    const mockJob: JobListingDto = {
      id: 'job-1',
      title: 'Full Stack Engineer',
      companyName: 'InnovateHub',
      collectedAtUtc: '2026-10-02T08:00:00Z',
      dataQualityStatus: 'Valid',
      experienceRange: '2-5 years',
      technology: { id: 'tech-1', name: 'Angular' },
      location: { id: 'loc-1', city: 'Pune', country: 'India' },
      source: { id: 'src-1', name: 'Naukri' }
    };

    service.getJobById('job-1').subscribe(res => {
      expect(res.title).toBe('Full Stack Engineer');
      expect(res.technology.name).toBe('Angular');
    });

    const req = httpTesting.expectOne('/api/v1/jobs/job-1');
    expect(req.request.method).toBe('GET');
    req.flush(mockJob);
  });

  it('should fetch freshness for a job', () => {
    const mockFreshness: JobFreshnessDto = {
      jobId: 'job-1',
      lastSeenAt: '2026-10-02T08:00:00Z',
      status: 'Fresh'
    };

    service.getFreshness('job-1').subscribe(res => {
      expect(res.status).toBe('Fresh');
    });

    const req = httpTesting.expectOne('/api/v1/jobs/job-1/freshness');
    expect(req.request.method).toBe('GET');
    req.flush(mockFreshness);
  });

  it('should upload CSV and return import summary', () => {
    const mockSummary: JobListingImportSummary = {
      totalRows: 10,
      importedRows: 8,
      skippedRows: 0,
      duplicateRows: 1,
      invalidRows: 1,
      errors: [{ rowNumber: 10, reason: 'Missing title' }],
      importBatchId: 'batch-1'
    };

    const file = new File(['header\nrow1'], 'test.csv', { type: 'text/csv' });
    service.importCsv(file).subscribe(res => {
      expect(res.importedRows).toBe(8);
      expect(res.invalidRows).toBe(1);
    });

    const req = httpTesting.expectOne('/api/v1/jobs/import');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(mockSummary);
  });
});
