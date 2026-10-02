import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ExperienceRangeService } from './experience-range.service';
import { ExperienceRangeOption } from '../models/experience-range.model';

describe('ExperienceRangeService', () => {
  let service: ExperienceRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExperienceRangeService]
    });
    service = TestBed.inject(ExperienceRangeService);
  });

  it('should return approved business experience range options', async () => {
    const options = await firstValueFrom(service.getExperienceRanges());
    expect(options.length).toBeGreaterThan(0);
    expect(options.some(o => o.label === '2-5 years')).toBe(true);
  });

  it('should support updating options dynamically when configured', async () => {
    const customOptions: ExperienceRangeOption[] = [
      { id: 'custom-tier-1', label: '0-1 years' },
      { id: 'custom-tier-2', label: '1-3 years' }
    ];

    service.setExperienceRanges(customOptions);

    const options = await firstValueFrom(service.getExperienceRanges());
    expect(options.length).toBe(2);
    expect(options[0].id).toBe('custom-tier-1');
  });
});
