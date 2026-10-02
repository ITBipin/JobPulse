import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { demoDataInterceptor } from './demo-data.interceptor';
import { DemoDataService } from '../services/demo-data.service';

describe('demoDataInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        DemoDataService,
        provideHttpClient(withInterceptors([demoDataInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpTesting.verify();
  });

  it('should pass through normal requests when not in demo mode', () => {
    http.get('/api/v1/test-pass').subscribe(res => {
      expect(res).toEqual({ passed: true });
    });

    const req = httpTesting.expectOne('/api/v1/test-pass');
    req.flush({ passed: true });
  });

  it('should intercept overview request when demo mode is active', () => {
    localStorage.setItem('jobpulse_demo_mode', 'true');

    http.get<any>('/api/v1/dashboard/overview').subscribe(res => {
      expect(res).toBeDefined();
      expect(res.activeTrackedJobListings).toBeGreaterThan(0);
      expect(res.dataSource).toBe('sample_platform_demo');
    });

    // In demo mode, no request goes to HttpTestingController backend
    httpTesting.expectNone('/api/v1/dashboard/overview');
  });

  it('should intercept jobs request with search when demo mode is active', () => {
    localStorage.setItem('jobpulse_demo_mode', 'true');

    http.get<any>('/api/v1/jobs?search=Angular').subscribe(res => {
      expect(res).toBeDefined();
      expect(res.items.length).toBeGreaterThan(0);
    });

    httpTesting.expectNone('/api/v1/jobs?search=Angular');
  });
});
