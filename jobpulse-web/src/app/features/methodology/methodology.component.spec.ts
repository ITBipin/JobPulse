import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MethodologyComponent } from './methodology.component';

describe('MethodologyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MethodologyComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create and render methodology content', () => {
    const fixture = TestBed.createComponent(MethodologyComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Methodology & Data Transparency');
    expect(el.textContent).toContain('Tracked Job Listings');
    expect(el.textContent).toContain('Voluntary Registrations');
    expect(el.textContent).toContain('Market Pressure Ratio');
    expect(el.textContent).toContain('Data Freshness & Verification SLA');
  });

  it('should render freshness tiers with badges', () => {
    const fixture = TestBed.createComponent(MethodologyComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.tier-fresh')).toBeTruthy();
    expect(el.querySelector('.tier-stale')).toBeTruthy();
    expect(el.querySelector('.tier-expired')).toBeTruthy();
  });
});
