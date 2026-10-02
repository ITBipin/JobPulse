import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TechnologyService } from './technology.service';
import { TechnologyDto } from '../models/technology.model';

describe('TechnologyService', () => {
  let service: TechnologyService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TechnologyService
      ]
    });
    service = TestBed.inject(TechnologyService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch technologies without search filter', () => {
    const mockList: TechnologyDto[] = [
      { id: 't1', name: '.NET', isActive: true },
      { id: 't2', name: 'Angular', isActive: true }
    ];

    service.getTechnologies().subscribe(list => {
      expect(list.length).toBe(2);
      expect(list[0].name).toBe('.NET');
    });

    const req = httpTesting.expectOne('/api/v1/technologies');
    expect(req.request.method).toBe('GET');
    req.flush(mockList);
  });

  it('should fetch technologies with search filter', () => {
    const mockList: TechnologyDto[] = [
      { id: 't2', name: 'Angular', isActive: true }
    ];

    service.getTechnologies('ang').subscribe(list => {
      expect(list.length).toBe(1);
    });

    const req = httpTesting.expectOne(r => r.url === '/api/v1/technologies');
    expect(req.request.params.get('search')).toBe('ang');
    req.flush(mockList);
  });
});
