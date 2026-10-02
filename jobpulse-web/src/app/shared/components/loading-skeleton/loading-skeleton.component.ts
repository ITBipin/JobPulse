import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-wrapper" [class]="'type-' + type()" [style.height]="height()" aria-busy="true" aria-live="polite">
      @if (type() === 'card') {
        <div class="skeleton-card">
          <div class="shimmer header-line"></div>
          <div class="shimmer big-line"></div>
          <div class="shimmer sub-line"></div>
        </div>
      } @else if (type() === 'chart') {
        <div class="skeleton-chart">
          <div class="shimmer chart-header"></div>
          <div class="chart-bars">
            <div class="shimmer bar h-60"></div>
            <div class="shimmer bar h-80"></div>
            <div class="shimmer bar h-40"></div>
            <div class="shimmer bar h-90"></div>
            <div class="shimmer bar h-70"></div>
          </div>
        </div>
      } @else if (type() === 'table') {
        <div class="skeleton-table">
          <div class="shimmer table-head"></div>
          @for (i of rowsArray(); track i) {
            <div class="shimmer table-row"></div>
          }
        </div>
      } @else {
        <div class="skeleton-text">
          @for (i of rowsArray(); track i) {
            <div class="shimmer text-line" [style.width]="i === rowsArray().length - 1 ? '60%' : '100%'"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      width: 100%;
    }

    .shimmer {
      background: linear-gradient(
        90deg,
        var(--jp-bg-subtle) 25%,
        var(--jp-border-subtle) 50%,
        var(--jp-bg-subtle) 75%
      );
      background-size: 200% 100%;
      animation: shimmer-sweep 1.6s infinite ease-in-out;
      border-radius: var(--jp-radius-sm);
    }

    @keyframes shimmer-sweep {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .skeleton-card {
      padding: 1.5rem;
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      background: var(--jp-bg-surface);
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .header-line { height: 16px; width: 40%; }
      .big-line { height: 36px; width: 60%; }
      .sub-line { height: 14px; width: 50%; }
    }

    .skeleton-chart {
      padding: 1.5rem;
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      background: var(--jp-bg-surface);
      height: 320px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .chart-header { height: 20px; width: 30%; }
      .chart-bars {
        flex: 1;
        display: flex;
        align-items: flex-end;
        gap: 1.5rem;
        padding-top: 2rem;

        .bar {
          flex: 1;
          &.h-40 { height: 40%; }
          &.h-60 { height: 60%; }
          &.h-70 { height: 70%; }
          &.h-80 { height: 80%; }
          &.h-90 { height: 90%; }
        }
      }
    }

    .skeleton-table {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;

      .table-head { height: 36px; width: 100%; }
      .table-row { height: 44px; width: 100%; }
    }

    .skeleton-text {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;

      .text-line { height: 16px; }
    }
  `]
})
export class LoadingSkeletonComponent {
  readonly type = input<'card' | 'chart' | 'table' | 'text'>('card');
  readonly rows = input<number>(4);
  readonly height = input<string>('auto');

  protected rowsArray(): number[] {
    return Array.from({ length: this.rows() }, (_, i) => i);
  }
}
