import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state" role="status">
      <div class="icon-circle">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <h3 class="title">{{ title() }}</h3>
      <p class="message">{{ message() }}</p>

      @if (actionLabel()) {
        <button mat-stroked-button color="primary" (click)="actionClick.emit()" class="action-btn">
          @if (actionIcon()) {
            <mat-icon>{{ actionIcon() }}</mat-icon>
          }
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3.5rem 1.5rem;
      border: 1px dashed var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      background-color: var(--jp-bg-surface);
      margin: 1rem 0;
    }

    .icon-circle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: var(--jp-bg-subtle);
      color: var(--jp-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--jp-text-primary);
      margin: 0 0 0.5rem 0;
    }

    .message {
      font-size: 0.875rem;
      color: var(--jp-text-muted);
      margin: 0 0 1.25rem 0;
      max-width: 440px;
      line-height: 1.5;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }
  `]
})
export class EmptyStateComponent {
  readonly icon = input<string>('search_off');
  readonly title = input<string>('No records found');
  readonly message = input<string>('No data is currently available matching the selected criteria.');
  readonly actionLabel = input<string>();
  readonly actionIcon = input<string>();
  readonly actionClick = output<void>();
}
