import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { ThemeService } from '../../../core/services/theme.service';
import { LoadingSkeletonComponent } from '../loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [CommonModule, LoadingSkeletonComponent, EmptyStateComponent],
  template: `
    <div class="chart-wrapper">
      <div class="chart-header">
        <div>
          <h3 class="chart-title">{{ title() }}</h3>
          @if (subtitle()) {
            <span class="chart-subtitle">{{ subtitle() }}</span>
          }
        </div>
        @if (sourceInfo()) {
          <div class="chart-meta">
            <span class="meta-tag">{{ sourceInfo() }}</span>
          </div>
        }
      </div>

      <div class="chart-body" [style.height]="height()">
        @if (isLoading()) {
          <app-loading-skeleton type="chart" [height]="height()"></app-loading-skeleton>
        } @else if (isEmpty()) {
          <app-empty-state
            icon="show_chart"
            [title]="emptyTitle()"
            [message]="emptyMessage()"
          ></app-empty-state>
        } @else {
          <div
            #chartHost
            class="chart-host"
            role="img"
            [attr.aria-label]="title() + ': ' + (subtitle() || '')"
          ></div>
        }
      </div>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      box-shadow: var(--jp-shadow-sm);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;

      .chart-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--jp-text-primary);
        margin: 0;
        line-height: 1.3;
      }

      .chart-subtitle {
        font-size: 0.8125rem;
        color: var(--jp-text-muted);
      }

      .chart-meta {
        .meta-tag {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          background-color: var(--jp-bg-subtle);
          color: var(--jp-text-muted);
          border-radius: var(--jp-radius-sm);
          font-weight: 500;
        }
      }
    }

    .chart-body {
      position: relative;
      width: 100%;
    }

    .chart-host {
      width: 100%;
      height: 100%;
    }
  `]
})
export class ChartContainerComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private chartInstance?: echarts.ECharts;
  private resizeObserver?: ResizeObserver;

  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly sourceInfo = input<string>();
  readonly height = input<string>('340px');
  readonly options = input<echarts.EChartsOption | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly isEmpty = input<boolean>(false);
  readonly emptyTitle = input<string>('No Chart Data Available');
  readonly emptyMessage = input<string>('Historical records or distribution counts have not been accumulated yet.');

  readonly chartHost = viewChild<ElementRef<HTMLDivElement>>('chartHost');

  constructor() {
    // Re-render chart on theme changes
    effect(() => {
      const isDark = this.themeService.isDark();
      const currentOpts = this.options();
      if (this.chartInstance && currentOpts) {
        this.applyOptions(currentOpts, isDark);
      }
    });

    // Update chart when options change
    effect(() => {
      const opts = this.options();
      const isDark = this.themeService.isDark();
      if (opts && this.chartInstance) {
        this.applyOptions(opts, isDark);
      } else if (opts && !this.chartInstance) {
        setTimeout(() => this.initChart(), 0);
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => this.initChart(), 0);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.chartInstance?.dispose();
  }

  private initChart(): void {
    const host = this.chartHost();
    if (!host || this.chartInstance || this.isLoading() || this.isEmpty()) {
      return;
    }

    const hostEl = host.nativeElement;
    // In headless test environments with 0 dimension, avoid initializing ECharts DOM renderer
    if (typeof window !== 'undefined' && (window as any).vi && hostEl.clientWidth === 0) {
      return;
    }

    // Use SVG renderer for vector scaling and jsdom/test compatibility
    this.chartInstance = echarts.init(hostEl, undefined, { renderer: 'svg' });

    const opts = this.options();
    if (opts) {
      this.applyOptions(opts, this.themeService.isDark());
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.chartInstance?.resize();
      });
      this.resizeObserver.observe(hostEl);
    }
  }

  private applyOptions(opts: echarts.EChartsOption, isDark: boolean): void {
    if (!this.chartInstance) return;

    const themedOpts: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: "'Inter', sans-serif",
        color: isDark ? '#94a3b8' : '#64748b'
      },
      ...opts
    };

    this.chartInstance.setOption(themedOpts, true);
  }
}
