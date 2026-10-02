import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('Application Routing Integration', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync()
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should redirect default empty path to /dashboard', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/dashboard');
  });

  it('should navigate to /jobs', async () => {
    await router.navigate(['/jobs']);
    expect(location.path()).toBe('/jobs');
  });

  it('should navigate to /job-seekers', async () => {
    await router.navigate(['/job-seekers']);
    expect(location.path()).toBe('/job-seekers');
  });

  it('should navigate to /methodology', async () => {
    await router.navigate(['/methodology']);
    expect(location.path()).toBe('/methodology');
  });

  it('should navigate to /jobs/:id', async () => {
    await router.navigate(['/jobs', 'job-test-uuid']);
    expect(location.path()).toBe('/jobs/job-test-uuid');
  });

  it('should redirect invalid unknown routes to /dashboard', async () => {
    await router.navigate(['/unknown-path-which-does-not-exist']);
    expect(location.path()).toBe('/dashboard');
  });
});
