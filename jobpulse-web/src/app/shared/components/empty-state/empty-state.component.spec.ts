import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();
  });

  it('should render default title and message', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.title')?.textContent).toBe('No records found');
  });

  it('should emit actionClick when action button is clicked', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('actionLabel', 'Reset Filters');
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.actionClick.subscribe(() => (emitted = true));

    const btn = fixture.nativeElement.querySelector('.action-btn') as HTMLButtonElement;
    btn.click();
    expect(emitted).toBe(true);
  });
});
