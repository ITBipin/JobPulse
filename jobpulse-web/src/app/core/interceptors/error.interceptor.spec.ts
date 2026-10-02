import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { AppError } from '../models/api-error.model';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should map 400 validation error properly', () => {
    let capturedError: AppError | undefined;

    http.get('/test-endpoint').subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (err: AppError) => {
        capturedError = err;
      }
    });

    const req = httpTesting.expectOne('/test-endpoint');
    req.flush(
      {
        title: 'Validation failed',
        detail: 'Name is required.',
        errors: { name: ['The name field is required.'] }
      },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(capturedError).toBeDefined();
    expect(capturedError?.status).toBe(400);
    expect(capturedError?.message).toBe('Validation failed');
    expect(capturedError?.detail).toBe('Name is required.');
    expect(capturedError?.validationErrors?.['name']).toBeDefined();
  });

  it('should map 404 not found error', () => {
    let capturedError: AppError | undefined;

    http.get('/test-endpoint').subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (err: AppError) => {
        capturedError = err;
      }
    });

    const req = httpTesting.expectOne('/test-endpoint');
    req.flush(
      { detail: 'Job listing not found.' },
      { status: 404, statusText: 'Not Found' }
    );

    expect(capturedError?.status).toBe(404);
    expect(capturedError?.message).toBe('Job listing not found.');
  });

  it('should map 413 payload too large error', () => {
    let capturedError: AppError | undefined;

    http.post('/test-upload', {}).subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (err: AppError) => {
        capturedError = err;
      }
    });

    const req = httpTesting.expectOne('/test-upload');
    req.flush(
      { detail: 'The maximum CSV upload size is 10 MiB.' },
      { status: 413, statusText: 'Payload Too Large' }
    );

    expect(capturedError?.status).toBe(413);
    expect(capturedError?.message).toBe('The maximum CSV upload size is 10 MiB.');
  });

  it('should sanitize 500 internal server error without leaking internals', () => {
    let capturedError: AppError | undefined;

    http.get('/test-500').subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (err: AppError) => {
        capturedError = err;
      }
    });

    const req = httpTesting.expectOne('/test-500');
    req.flush(
      { detail: 'SqlException: Timeout expired at System.Data.SqlClient...' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    expect(capturedError?.status).toBe(500);
    expect(capturedError?.message).toBe('The JobPulse service is temporarily unavailable. Please try again later.');
    expect(capturedError?.detail).toBeUndefined();
  });

  it('should map 0 status network connection failures', () => {
    let capturedError: AppError | undefined;

    http.get('/test-network').subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (err: AppError) => {
        capturedError = err;
      }
    });

    const req = httpTesting.expectOne('/test-network');
    req.error(new ProgressEvent('error'), { status: 0 });

    expect(capturedError?.status).toBe(0);
    expect(capturedError?.message).toBe('Unable to reach the JobPulse service. Please verify your network connection.');
  });

  it('should map 401 unauthorized and 403 forbidden', () => {
    let capturedError401: AppError | undefined;
    let capturedError403: AppError | undefined;

    http.get('/test-401').subscribe({
      next: () => {},
      error: (err: AppError) => { capturedError401 = err; }
    });
    httpTesting.expectOne('/test-401').flush({}, { status: 401, statusText: 'Unauthorized' });

    http.get('/test-403').subscribe({
      next: () => {},
      error: (err: AppError) => { capturedError403 = err; }
    });
    httpTesting.expectOne('/test-403').flush({}, { status: 403, statusText: 'Forbidden' });

    expect(capturedError401?.status).toBe(401);
    expect(capturedError401?.message).toBe('Authentication required. Please sign in to proceed.');

    expect(capturedError403?.status).toBe(403);
    expect(capturedError403?.message).toBe('Access denied. You do not have permission to perform this action.');
  });

  it('should map 429 rate limit exceeded', () => {
    let capturedError: AppError | undefined;

    http.get('/test-429').subscribe({
      next: () => {},
      error: (err: AppError) => { capturedError = err; }
    });
    httpTesting.expectOne('/test-429').flush({}, { status: 429, statusText: 'Too Many Requests' });

    expect(capturedError?.status).toBe(429);
    expect(capturedError?.message).toBe('Too many requests. Please try again shortly.');
  });

  it('should map 503 service unavailable', () => {
    let capturedError: AppError | undefined;

    http.get('/test-503').subscribe({
      next: () => {},
      error: (err: AppError) => { capturedError = err; }
    });
    httpTesting.expectOne('/test-503').flush({}, { status: 503, statusText: 'Service Unavailable' });

    expect(capturedError?.status).toBe(503);
    expect(capturedError?.message).toBe('The JobPulse service is temporarily unavailable. Please try again later.');
  });
});
