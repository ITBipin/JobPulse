import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrandLogoComponent } from './brand-logo.component';

describe('BrandLogoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandLogoComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the brand logo component', () => {
    const fixture = TestBed.createComponent(BrandLogoComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render brand text and subtitle by default', () => {
    const fixture = TestBed.createComponent(BrandLogoComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('JobPulse');
    expect(compiled.querySelector('.brand-subtitle')?.textContent).toContain('India Intelligence');
    expect(compiled.querySelector('.emblem-svg')).toBeTruthy();
  });

  it('should hide text when showText is false', () => {
    const fixture = TestBed.createComponent(BrandLogoComponent);
    fixture.componentRef.setInput('showText', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-text')).toBeNull();
    expect(compiled.querySelector('.emblem-svg')).toBeTruthy();
  });
});
