import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExperienceRangeOption } from '../models/experience-range.model';

@Injectable({
  providedIn: 'root'
})
export class ExperienceRangeService {
  /**
   * Configurable source for experience range options.
   * Isolates experience range configuration behind a dedicated abstraction
   * as the backend currently does not expose a GET /api/v1/experience-ranges endpoint.
   * Labels correspond to the project's approved business tiers in seed data.
   */
  private options: ExperienceRangeOption[] = [
    { id: '1-3-years', label: '1-3 years' },
    { id: '2-5-years', label: '2-5 years' },
    { id: '4-8-years', label: '4-8 years' },
    { id: '5-8-years', label: '5-8 years' }
  ];

  getExperienceRanges(): Observable<ExperienceRangeOption[]> {
    return of([...this.options]);
  }

  setExperienceRanges(options: ExperienceRangeOption[]): void {
    this.options = [...options];
  }
}
