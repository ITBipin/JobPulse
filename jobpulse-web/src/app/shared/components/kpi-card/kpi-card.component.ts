import { Component, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatCardModule, MatIconModule, MatTooltipModule],
  template: `
    <mat-card class="kpi-card" [class.loading]="isLoading()" [class.accent-brand]="accentColor() === 'brand'" [class.accent-success]="accentColor() === 'success'" [class.accent-warning]="accentColor() === 'warning'">
      @if (isLoading()) {
        <div class="kpi-skeleton">
          <div class="skeleton-header">
            <div class="skeleton-pill"></div>
            <div class="skeleton-circle"></div>
          </div>
          <div class="skeleton-value"></div>
          <div class="skeleton-caption"></div>
        </div>
      } @else {
        <div class="kpi-header">
          <div class="title-wrap">
            <span class="kpi-title">{{ title() }}</span>
            @if (infoTooltip()) {
              <mat-icon
                class="info-icon"
                [matTooltip]="infoTooltip()!"
                aria-label="More information"
              >info_outline</mat-icon>
            }
          </div>
          @if (icon()) {
            <div class="icon-wrap">
              <mat-icon>{{ icon() }}</mat-icon>
            </div>
          }
        </div>

        <div class="kpi-body">
          <div class="kpi-value">
            @if (value() !== null && value() !== undefined) {
              @if (isFormattedNumber()) {
                {{ value() | number }}
              } @else {
                {{ value() }}
              }
            } @else {
              <span class="value-unavailable">N/A</span>
            }
          </div>
          @if (subtitle()) {
            <div class="kpi-subtitle">
              @if (trendText()) {
                <span class="trend-badge" [class.positive]="trendPositive()" [class.negative]="!trendPositive()">
                  <mat-icon class="trend-icon">{{ trendPositive() ? 'trending_up' : 'trending_down' }}</mat-icon>
                  {{ trendText() }}
                </span>
              }
              <span>{{ subtitle() }}</span>
            </div>
          }
        </div>

        @if (footnote()) {
          <div class="kpi-footnote">
            <mat-icon class="foot-icon">schedule</mat-icon>
            <span>{{ footnote() }}</span>
          </div>
        }
      }
    </mat-card>
  `,
  styles: [`
    .kpi-card {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      box-shadow: var(--jp-shadow-sm);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

      &:hover {
        border-color: var(--jp-brand-primary);
        box-shadow: var(--jp-shadow-md);
      }

      &.accent-brand .icon-wrap {
        background-color: var(--jp-brand-subtle);
        color: var(--jp-brand-primary);
      }

      &.accent-success .icon-wrap {
        background-color: var(--jp-success-bg);
        color: var(--jp-success);
      }

      &.accent-warning .icon-wrap {
        background-color: var(--jp-warning-bg);
        color: var(--jp-warning);
      }
    }

    .kpi-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;

      .title-wrap {
        display: flex;
        align-items: center;
        gap: 0.375rem;

        .kpi-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--jp-text-secondary);
          line-height: 1.3;
        }

        .info-icon {
          font-size: 15px;
          width: 15px;
          height: 15px;
          color: var(--jp-text-muted);
          cursor: help;
        }
      }

      .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: var(--jp-radius-sm);
        background-color: var(--jp-bg-subtle);
        color: var(--jp-brand-primary);
        flex-shrink: 0;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .kpi-body {
      .kpi-value {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.03em;
        color: var(--jp-text-primary);
        line-height: 1.1;

        .value-unavailable {
          color: var(--jp-text-disabled);
          font-size: 1.5rem;
        }
      }

      .kpi-subtitle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
        color: var(--jp-text-muted);
        margin-top: 0.375rem;
        flex-wrap: wrap;

        .trend-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.125rem;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 0.1rem 0.35rem;
          border-radius: var(--jp-radius-sm);

          &.positive {
            background-color: var(--jp-success-bg);
            color: var(--jp-success);
          }

          &.negative {
            background-color: var(--jp-danger-bg);
            color: var(--jp-danger);
          }

          .trend-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }
    }

    .kpi-footnote {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding-top: 0.625rem;
      border-top: 1px solid var(--jp-border-subtle);
      font-size: 0.75rem;
      color: var(--jp-text-muted);

      .foot-icon {
        font-size: 13px;
        width: 13px;
        height: 13px;
      }
    }

    // Skeleton animation
    .kpi-skeleton {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .skeleton-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .skeleton-pill {
          width: 90px;
          height: 14px;
          background: linear-gradient(90deg, var(--jp-bg-subtle) 25%, var(--jp-border-subtle) 50%, var(--jp-bg-subtle) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--jp-radius-sm);
        }

        .skeleton-circle {
          width: 32px;
          height: 32px;
          border-radius: var(--jp-radius-sm);
          background: var(--jp-bg-subtle);
        }
      }

      .skeleton-value {
        width: 120px;
        height: 32px;
        background: linear-gradient(90deg, var(--jp-bg-subtle) 25%, var(--jp-border-subtle) 50%, var(--jp-bg-subtle) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--jp-radius-sm);
      }

      .skeleton-caption {
        width: 140px;
        height: 12px;
        background: var(--jp-bg-subtle);
        border-radius: var(--jp-radius-sm);
      }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class KpiCardComponent {
  readonly title = input.required<string>();
  readonly value = input<number | string | null>();
  readonly subtitle = input<string>();
  readonly icon = input<string>();
  readonly accentColor = input<'brand' | 'success' | 'warning' | 'default'>('brand');
  readonly infoTooltip = input<string>();
  readonly footnote = input<string>();
  readonly isLoading = input<boolean>(false);
  readonly isFormattedNumber = input<boolean>(true);
  readonly trendText = input<string>();
  readonly trendPositive = input<boolean>(true);
}
