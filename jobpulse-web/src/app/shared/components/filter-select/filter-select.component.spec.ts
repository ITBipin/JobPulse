import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FilterSelectComponent } from './filter-select.component';

describe('FilterSelectComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSelectComponent],
      providers: [provideAnimationsAsync()]
    }).compileComponents();
  });

  it('should render label and clear button when value selected', () => {
    const fixture = TestBed.createComponent(FilterSelectComponent);
    fixture.componentRef.setInput('label', 'Technology');
    fixture.componentRef.setInput('options', [{ id: '1', label: 'C#' }]);
    fixture.componentRef.setInput('selectedValue', '1');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.filter-field mat-label')?.textContent).toContain('Technology');
    expect(el.querySelector('.clear-btn')).toBeTruthy();
  });

  it('should emit clear event when clear button clicked', () => {
    const fixture = TestBed.createComponent(FilterSelectComponent);
    fixture.componentRef.setInput('label', 'City');
    fixture.componentRef.setInput('selectedValue', 'blr');
    fixture.detectChanges();

    let cleared = false;
    fixture.componentInstance.clear.subscribe(() => (cleared = true));

    const clearBtn = fixture.nativeElement.querySelector('.clear-btn') as HTMLButtonElement;
    clearBtn.click();
    expect(cleared).toBe(true);
  });
});
