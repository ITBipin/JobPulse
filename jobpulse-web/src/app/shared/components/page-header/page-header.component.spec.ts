import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should render title and subtitle', () => {
    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.componentRef.setInput('title', 'Market Overview');
    fixture.componentRef.setInput('subtitle', 'India Tech Trends');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Market Overview');
    expect(compiled.querySelector('.subtitle')?.textContent).toContain('India Tech Trends');
  });

  it('should render breadcrumbs when provided', () => {
    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.componentRef.setInput('title', 'Jobs');
    fixture.componentRef.setInput('breadcrumbs', [
      { label: 'Home', url: '/' },
      { label: 'Jobs' }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.breadcrumbs li');
    expect(links.length).toBe(2);
  });
});
