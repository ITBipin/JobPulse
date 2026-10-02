import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  const mockDialogRef = {
    close: (result?: boolean) => result
  };

  const mockData: ConfirmDialogData = {
    title: 'Confirm Delete',
    message: 'Are you sure you want to proceed?',
    confirmLabel: 'Yes, Delete',
    cancelLabel: 'Cancel',
    isDestructive: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();
  });

  it('should render dialog title and message', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.dialog-title')?.textContent).toContain('Confirm Delete');
    expect(el.querySelector('.dialog-content')?.textContent).toContain('Are you sure you want to proceed?');
  });
});
