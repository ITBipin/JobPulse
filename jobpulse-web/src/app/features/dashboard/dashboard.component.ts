import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DashboardService } from '../../core/services/dashboard.service';
import { ThemeService } from '../../core/services/theme.service';
import {
  DashboardOverviewResponse,
  DashboardTrendsResponse
} from '../../core/models/dashboard.model';
import { AppError } from '../../core/models/api-error.model';
import { isStaticOrDemoEnvironment } from '../../core/interceptors/demo-data.interceptor';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { ChartContainerComponent } from '../../shared/components/chart-container/chart-container.component';
import { PressureRatioCardComponent } from './pressure-ratio-card.component';
import {
  buildCityDistributionOptions,
  buildTechDistributionOptions,
  buildTrendsChartOptions
} from './dashboard-chart.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    PageHeaderComponent,
    KpiCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    ChartContainerComponent,
    PressureRatioCardComponent
  ],
  template: `
    <div class="dashboard-page">
      <app-page-header
        title="India Job Market Intelligence"
        subtitle="Live platform tracking of active openings, voluntary candidate volume, and hiring demand across India's tech ecosystem."
        badge="Platform Intelligence"
      >
        <div actions class="header-actions">
          <button mat-stroked-button (click)="loadAll()" [disabled]="isLoading()" aria-label="Refresh dashboard data">
            <mat-icon [class.spinning]="isLoading()">refresh</mat-icon>
            <span>Refresh</span>
          </button>
          <a mat-flat-button color="primary" routerLink="/jobs">
            <mat-icon>search</mat-icon>
            <span>Explore Openings</span>
          </a>
        </div>
      </app-page-header>

      <!-- Transparency notice banner -->
      <div class="transparency-banner">
        <mat-icon class="banner-icon">verified_user</mat-icon>
        <div class="banner-content">
          <strong>Data Transparency Notice:</strong> Metrics below reflect active listings tracked by JobPulse and voluntary candidate registrations. They do not represent total nationwide employment figures.
        </div>
        <a routerLink="/methodology" class="methodology-link">View Methodology &rarr;</a>
      </div>

      <!-- Demo Preview Notice banner -->
      @if (isDemoMode) {
        <div class="demo-notice-banner">
          <mat-icon class="banner-icon">insights</mat-icon>
          <div class="banner-content">
            <strong>Static Demo Preview:</strong> Displaying illustrative sample India tech ecosystem intelligence on GitHub Pages. To view live database metrics, connect your JobPulse .NET backend.
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <app-error-state
          title="Unable to load dashboard data"
          [message]="errorMessage()"
          (retry)="loadAll()"
        ></app-error-state>
      }

      <!-- Main Dashboard Grid -->
      @if (!error()) {
        <section class="kpi-grid" aria-label="Key Performance Indicators">
          <app-kpi-card
            title="Active Tracked Openings"
            [value]="overviewData()?.activeTrackedJobListings ?? null"
            subtitle="Verified open positions"
            icon="work"
            accentColor="brand"
            [isLoading]="isLoading()"
            infoTooltip="Verified open job postings collected and refreshed across platform feeds within data freshness SLAs."
            [footnote]="overviewData()?.lastDataUpdate ? 'Updated ' + (overviewData()?.lastDataUpdate | date:'short') : undefined"
          ></app-kpi-card>

          <app-kpi-card
            title="Voluntary Registered Seekers"
            [value]="overviewData()?.activeRegisteredJobSeekers ?? null"
            subtitle="JobPulse registered candidates"
            icon="people_alt"
            accentColor="brand"
            [isLoading]="isLoading()"
            infoTooltip="Voluntary registered seekers with OpenToWork status confirmed within the activity window. Does NOT represent total Indian job seekers."
            [footnote]="'Source: ' + (overviewData()?.dataSource || 'platform_registered')"
          ></app-kpi-card>

          <app-kpi-card
            title="New Openings (Last 7 Days)"
            [value]="overviewData()?.newListingsLast7Days ?? null"
            subtitle="Weekly inflow rate"
            icon="new_releases"
            accentColor="success"
            [isLoading]="isLoading()"
            infoTooltip="Net-new job listings first imported into JobPulse during the previous 7 days."
          ></app-kpi-card>

          <app-kpi-card
            title="New Openings (Last 30 Days)"
            [value]="overviewData()?.newListingsLast30Days ?? null"
            subtitle="Monthly hiring momentum"
            icon="trending_up"
            accentColor="warning"
            [isLoading]="isLoading()"
            infoTooltip="Net-new job listings first imported into JobPulse during the previous 30 calendar days."
          ></app-kpi-card>
        </section>

        <!-- Empty State (if data is loaded but both listings and seekers are 0) -->
        @if (!isLoading() && overviewData() && overviewData()?.activeTrackedJobListings === 0 && overviewData()?.activeRegisteredJobSeekers === 0) {
          <app-empty-state
            icon="analytics"
            title="No Active Market Data Yet"
            message="No job listings or candidate registrations have been recorded. New data will appear as sources are synced."
            actionLabel="Refresh Data"
            actionIcon="refresh"
            (actionClick)="loadAll()"
          ></app-empty-state>
        }

        <!-- Market Pressure Ratio Component -->
        <app-pressure-ratio-card></app-pressure-ratio-card>

        <!-- Historical Market Trends Chart -->
        <section aria-label="Market Trends Section">
          <app-chart-container
            title="Historical Market Trends"
            subtitle="Tracked openings vs registered seeker activity over daily market snapshots"
            [sourceInfo]="trendsData()?.dataSource ? 'Source: ' + trendsData()!.dataSource : 'Source: platform_snapshots'"
            [options]="trendsChartOptions()"
            [isLoading]="isLoadingTrends()"
            [isEmpty]="isTrendsEmpty()"
            emptyTitle="Historical Snapshots Unavailable"
            emptyMessage="Daily snapshots have not been accumulated for the selected period yet. New snapshot points will be recorded automatically."
            height="360px"
          ></app-chart-container>
        </section>

        <!-- Technology & Location Demand Visualizations -->
        <section class="breakdown-grid" aria-label="Distribution Charts">
          <app-chart-container
            title="Technology Demand Distribution"
            subtitle="Top skills ranked by active openings volume"
            sourceInfo="Source: platform_tracked"
            [options]="techChartOptions()"
            [isLoading]="isLoading()"
            [isEmpty]="isTechEmpty()"
            emptyTitle="No Technology Data"
            emptyMessage="Technology demand counts are not available yet."
            height="320px"
          ></app-chart-container>

          <app-chart-container
            title="City-Wise Job Distribution"
            subtitle="Top geographic hubs in India for active openings"
            sourceInfo="Source: platform_tracked"
            [options]="cityChartOptions()"
            [isLoading]="isLoading()"
            [isEmpty]="isCityEmpty()"
            emptyTitle="No Location Data"
            emptyMessage="City demand counts are not available yet."
            height="320px"
          ></app-chart-container>
        </section>
      }
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;

      .spinning {
        animation: spin 1s linear infinite;
      }
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .transparency-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      background-color: var(--jp-brand-subtle);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      font-size: 0.84375rem;
      color: var(--jp-text-secondary);
      flex-wrap: wrap;

      .banner-icon {
        color: var(--jp-brand-primary);
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .banner-content {
        flex: 1;
        min-width: 240px;

        strong {
          color: var(--jp-brand-text);
        }
      }

      .methodology-link {
        font-weight: 600;
        color: var(--jp-brand-text);
        text-decoration: none;
        white-space: nowrap;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .demo-notice-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      background-color: var(--jp-brand-subtle);
      border: 1px solid rgba(2, 132, 199, 0.25);
      border-radius: var(--jp-radius-md);
      margin-bottom: 1.5rem;
      font-size: 0.84375rem;
      color: var(--jp-text-secondary);

      .banner-icon {
        color: var(--jp-brand-primary);
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .banner-content {
        strong {
          color: var(--jp-brand-text);
        }
      }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.25rem;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly themeService = inject(ThemeService);

  readonly isDemoMode = isStaticOrDemoEnvironment();
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingTrends = signal<boolean>(true);
  readonly error = signal<AppError | string | null>(null);

  readonly overviewData = signal<DashboardOverviewResponse | null>(null);
  readonly trendsData = signal<DashboardTrendsResponse | null>(null);

  readonly isTrendsEmpty = computed(() => {
    const trends = this.trendsData();
    return !trends || !trends.data || trends.data.length === 0;
  });

  readonly isTechEmpty = computed(() => {
    const overview = this.overviewData();
    return !overview || !overview.topTechnologies || overview.topTechnologies.length === 0;
  });

  readonly isCityEmpty = computed(() => {
    const overview = this.overviewData();
    return !overview || !overview.topLocations || overview.topLocations.length === 0;
  });

  readonly trendsChartOptions = computed(() => {
    const trends = this.trendsData();
    if (!trends || !trends.data || trends.data.length === 0) return null;
    return buildTrendsChartOptions(trends.data, this.themeService.isDark());
  });

  readonly techChartOptions = computed(() => {
    const overview = this.overviewData();
    if (!overview || !overview.topTechnologies || overview.topTechnologies.length === 0) return null;
    return buildTechDistributionOptions(overview.topTechnologies, this.themeService.isDark());
  });

  readonly cityChartOptions = computed(() => {
    const overview = this.overviewData();
    if (!overview || !overview.topLocations || overview.topLocations.length === 0) return null;
    return buildCityDistributionOptions(overview.topLocations, this.themeService.isDark());
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loadOverview();
    this.loadTrends();
  }

  loadOverview(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.dashboardService.getOverview().subscribe({
      next: (response) => {
        this.overviewData.set(response);
        this.isLoading.set(false);
      },
      error: (err: AppError | Error) => {
        const errorMsg = 'message' in err ? err.message : 'Failed to retrieve overview statistics.';
        this.error.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }

  loadTrends(): void {
    this.isLoadingTrends.set(true);

    this.dashboardService.getTrends().subscribe({
      next: (response) => {
        this.trendsData.set(response);
        this.isLoadingTrends.set(false);
      },
      error: () => {
        this.isLoadingTrends.set(false);
      }
    });
  }

  errorMessage(): string {
    const err = this.error();
    if (typeof err === 'string') return err;
    if (err && 'message' in err) return err.message;
    return 'Failed to load dashboard overview from the backend.';
  }
}
