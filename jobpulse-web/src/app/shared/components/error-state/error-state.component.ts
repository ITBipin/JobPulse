import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="error-state" role="alert">
      <div class="icon-circle">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <h3 class="title">{{ title() }}</h3>
      <p class="message">{{ message() }}</p>

      @if (detail()) {
        <p class="detail">{{ detail() }}</p>
      }

      @if (canRetry()) {
        <button mat-flat-button color="primary" (click)="retry.emit()" class="retry-btn">
          <mat-icon>refresh</mat-icon>
          <span>{{ retryLabel() }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1.5rem;
      border: 1px solid var(--jp-danger-bg);
      border-radius: var(--jp-radius-md);
      background-color: var(--jp-bg-surface);
      margin: 1rem 0;
    }

    .icon-circle {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background-color: var(--jp-danger-bg);
      color: var(--jp-danger);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 26px;
        width: 26px;
        height: 26px;
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
      color: var(--jp-text-secondary);
      margin: 0 0 0.5rem 0;
      max-width: 480px;
      line-height: 1.5;
    }

    .detail {
      font-size: 0.8125rem;
      color: var(--jp-text-muted);
      margin: 0 0 1.25rem 0;
      max-width: 480px;
      font-family: monospace;
      padding: 0.35rem 0.75rem;
      background: var(--jp-bg-subtle);
      border-radius: var(--jp-radius-sm);
    }

    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      margin-top: 0.5rem;
    }
  `]
})
export class ErrorStateComponent {
  readonly title = input<string>('Failed to load data');
  readonly message = input<string>('An error occurred while fetching information from the server.');
  readonly detail = input<string>();
  readonly icon = input<string>('error_outline');
  readonly canRetry = input<boolean>(true);
  readonly retryLabel = input<string>('Try Again');
  readonly retry = output<void>();
}
