import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { LocationDto } from '../models/location.model';

describe('LocationService', () => {
  let service: LocationService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LocationService
      ]
    });
    service = TestBed.inject(LocationService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch locations without city filter', () => {
    const mockLocations: LocationDto[] = [
      { id: 'l1', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      { id: 'l2', city: 'Hyderabad', state: 'Telangana', country: 'India' }
    ];

    service.getLocations().subscribe(locations => {
      expect(locations.length).toBe(2);
      expect(locations[0].city).toBe('Bengaluru');
    });

    const req = httpTesting.expectOne('/api/v1/locations');
    expect(req.request.method).toBe('GET');
    req.flush(mockLocations);
  });

  it('should fetch locations with city search parameter', () => {
    const mockLocations: LocationDto[] = [
      { id: 'l1', city: 'Bengaluru', state: 'Karnataka', country: 'India' }
    ];

    service.getLocations('Bengaluru').subscribe(locations => {
      expect(locations.length).toBe(1);
    });

    const req = httpTesting.expectOne(r => r.url === '/api/v1/locations');
    expect(req.request.params.get('city')).toBe('Bengaluru');
    req.flush(mockLocations);
  });
});
