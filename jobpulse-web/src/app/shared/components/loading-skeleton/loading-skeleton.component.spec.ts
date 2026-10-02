import { TestBed } from '@angular/core/testing';
import { LoadingSkeletonComponent } from './loading-skeleton.component';

describe('LoadingSkeletonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSkeletonComponent]
    }).compileComponents();
  });

  it('should render card skeleton by default', () => {
    const fixture = TestBed.createComponent(LoadingSkeletonComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skeleton-card')).toBeTruthy();
  });

  it('should render chart skeleton when type is chart', () => {
    const fixture = TestBed.createComponent(LoadingSkeletonComponent);
    fixture.componentRef.setInput('type', 'chart');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skeleton-chart')).toBeTruthy();
  });
});
