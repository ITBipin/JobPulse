import { TestBed } from '@angular/core/testing';
import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent]
    }).compileComponents();
  });

  it('should render metric title and formatted value', () => {
    const fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentRef.setInput('title', 'Active Tracked Jobs');
    fixture.componentRef.setInput('value', 1250);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.kpi-title')?.textContent).toContain('Active Tracked Jobs');
    expect(el.querySelector('.kpi-value')?.textContent).toContain('1,250');
  });

  it('should display N/A when value is null', () => {
    const fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentRef.setInput('title', 'Pressure Ratio');
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.value-unavailable')?.textContent).toBe('N/A');
  });

  it('should display skeleton when loading', () => {
    const fixture = TestBed.createComponent(KpiCardComponent);
    fixture.componentRef.setInput('title', 'Loading Metric');
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.kpi-skeleton')).toBeTruthy();
  });
});
