import { TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent]
    }).compileComponents();
  });

  it('should render error message and retry button', () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('title', 'Network Error');
    fixture.componentRef.setInput('message', 'Cannot reach backend service.');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.title')?.textContent).toBe('Network Error');
    expect(el.querySelector('.message')?.textContent).toBe('Cannot reach backend service.');
  });

  it('should emit retry event on button click', () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.detectChanges();

    let retried = false;
    fixture.componentInstance.retry.subscribe(() => (retried = true));

    const btn = fixture.nativeElement.querySelector('.retry-btn') as HTMLButtonElement;
    btn.click();
    expect(retried).toBe(true);
  });
});
