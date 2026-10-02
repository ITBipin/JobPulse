import { Component, computed, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobFreshnessStatus } from '../../../core/models/job.model';

@Component({
  selector: 'app-data-freshness-badge',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule, MatTooltipModule],
  template: `
    <span
      class="freshness-badge"
      [class.fresh]="statusNormalized() === 'fresh'"
      [class.stale]="statusNormalized() === 'stale'"
      [class.expired]="statusNormalized() === 'expired'"
      [matTooltip]="tooltipText()"
    >
      <mat-icon class="status-dot">
        {{ statusNormalized() === 'fresh' ? 'check_circle' : statusNormalized() === 'stale' ? 'hourglass_top' : 'error' }}
      </mat-icon>
      <span class="status-label">{{ displayLabel() }}</span>
      @if (showTimestamp() && lastSeenAt()) {
        <span class="timestamp">({{ lastSeenAt() | date: 'mediumDate' }})</span>
      }
    </span>
  `,
  styles: [`
    .freshness-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
      cursor: default;

      .status-dot {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .timestamp {
        font-weight: 400;
        opacity: 0.85;
      }

      &.fresh {
        background-color: var(--jp-success-bg);
        color: var(--jp-success);
      }

      &.stale {
        background-color: var(--jp-warning-bg);
        color: var(--jp-warning);
      }

      &.expired {
        background-color: var(--jp-danger-bg);
        color: var(--jp-danger);
      }
    }
  `]
})
export class DataFreshnessBadgeComponent {
  readonly status = input.required<JobFreshnessStatus | string>();
  readonly lastSeenAt = input<string | null>();
  readonly showTimestamp = input<boolean>(false);

  readonly statusNormalized = computed(() => {
    const s = this.status()?.toLowerCase();
    if (s === 'fresh') return 'fresh';
    if (s === 'stale') return 'stale';
    return 'expired';
  });

  readonly displayLabel = computed(() => {
    const norm = this.statusNormalized();
    return norm.charAt(0).toUpperCase() + norm.slice(1);
  });

  readonly tooltipText = computed(() => {
    const norm = this.statusNormalized();
    if (norm === 'fresh') {
      return 'Fresh listing: verified active in the last 24 hours.';
    }
    if (norm === 'stale') {
      return 'Stale listing: last verified between 24 and 72 hours ago.';
    }
    return 'Expired listing: not seen for over 72 hours. May no longer be open.';
  });
}
