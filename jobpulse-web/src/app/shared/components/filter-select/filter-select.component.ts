import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface FilterOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-filter-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="filter-select-wrapper">
      <mat-form-field appearance="outline" density="compact" class="filter-field">
        <mat-label>{{ label() }}</mat-label>
        <mat-select
          [value]="selectedValue()"
          (selectionChange)="selectionChange.emit($event.value)"
          [placeholder]="placeholder()"
        >
          <mat-option [value]="null">All {{ label() }}s</mat-option>
          @for (option of options(); track option.id) {
            <mat-option [value]="option.id">{{ option.label }}</mat-option>
          }
        </mat-select>
        @if (selectedValue()) {
          <button
            matSuffix
            mat-icon-button
            aria-label="Clear filter"
            (click)="$event.stopPropagation(); clear.emit()"
            class="clear-btn"
          >
            <mat-icon>clear</mat-icon>
          </button>
        }
      </mat-form-field>
    </div>
  `,
  styles: [`
    .filter-select-wrapper {
      min-width: 180px;

      .filter-field {
        width: 100%;
        margin-bottom: -1.25em; // Reduce mat-form-field default bottom margin
      }

      .clear-btn {
        font-size: 16px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        color: var(--jp-text-muted);

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }
  `]
})
export class FilterSelectComponent {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('Select...');
  readonly options = input<FilterOption[]>([]);
  readonly selectedValue = input<string | null>(null);

  readonly selectionChange = output<string | null>();
  readonly clear = output<void>();
}
