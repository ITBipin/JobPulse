import { TestBed } from '@angular/core/testing';
import { DataFreshnessBadgeComponent } from './data-freshness-badge.component';

describe('DataFreshnessBadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFreshnessBadgeComponent]
    }).compileComponents();
  });

  it('should render fresh badge with label and class', () => {
    const fixture = TestBed.createComponent(DataFreshnessBadgeComponent);
    fixture.componentRef.setInput('status', 'Fresh');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.freshness-badge')?.classList.contains('fresh')).toBe(true);
    expect(el.querySelector('.status-label')?.textContent).toBe('Fresh');
  });

  it('should render stale badge correctly', () => {
    const fixture = TestBed.createComponent(DataFreshnessBadgeComponent);
    fixture.componentRef.setInput('status', 'Stale');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.freshness-badge')?.classList.contains('stale')).toBe(true);
    expect(el.querySelector('.status-label')?.textContent).toBe('Stale');
  });

  it('should render expired badge correctly', () => {
    const fixture = TestBed.createComponent(DataFreshnessBadgeComponent);
    fixture.componentRef.setInput('status', 'Expired');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.freshness-badge')?.classList.contains('expired')).toBe(true);
    expect(el.querySelector('.status-label')?.textContent).toBe('Expired');
  });
});
