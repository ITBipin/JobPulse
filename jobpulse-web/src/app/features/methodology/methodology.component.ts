import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DataFreshnessBadgeComponent } from '../../shared/components/data-freshness-badge/data-freshness-badge.component';

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    PageHeaderComponent,
    DataFreshnessBadgeComponent
  ],
  template: `
    <div class="methodology-page">
      <app-page-header
        title="Methodology &amp; Data Transparency"
        subtitle="A detailed breakdown of how JobPulse collects, validates, computes, and reports Indian tech job market intelligence."
        badge="Open Standard"
      >
        <div actions class="header-actions">
          <a mat-flat-button color="primary" routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            <span>View Dashboard</span>
          </a>
        </div>
      </app-page-header>

      <!-- Transparency Mission Banner -->
      <div class="mission-banner">
        <mat-icon class="banner-icon">shield</mat-icon>
        <div class="banner-text">
          <h2>Our Core Commitment to Truth in Data</h2>
          <p>
            JobPulse does not speculate, extrapolate artificial statistics, or claim to represent every worker or job in India. All numbers published are direct aggregations of verified platform-tracked records and voluntary participant submissions.
          </p>
        </div>
      </div>

      <!-- Principles Grid -->
      <section class="principles-grid" aria-label="Methodological Pillars">
        <mat-card class="principle-card">
          <div class="card-icon"><mat-icon>verified</mat-icon></div>
          <h3 class="card-title">1. Tracked Job Listings</h3>
          <p class="card-text">
            Listings are imported from verified partner feeds and automated ingestion pipelines. We store collection dates, original posting dates, and canonical source references.
          </p>
          <div class="limitation-box">
            <strong>Scope &amp; Limitation:</strong> Coverage is limited to integrated feeds and active imports. It does not represent total nationwide hiring.
          </div>
        </mat-card>

        <mat-card class="principle-card">
          <div class="card-icon"><mat-icon>lock</mat-icon></div>
          <h3 class="card-title">2. Voluntary Registrations</h3>
          <p class="card-text">
            Candidates register voluntarily to contribute to open supply metrics. No personally identifiable information (names, emails, phone numbers, or resumes) is ever requested or saved.
          </p>
          <div class="limitation-box">
            <strong>Scope &amp; Limitation:</strong> Represents registered JobPulse participants only, requiring confirmation within a 30-day activity window.
          </div>
        </mat-card>

        <mat-card class="principle-card">
          <div class="card-icon"><mat-icon>calculate</mat-icon></div>
          <h3 class="card-title">3. Market Pressure Ratio</h3>
          <p class="card-text">
            Calculated strictly as <code>Active Registered Seekers / Active Tracked Openings</code>. Provides an indicator of competitive density across specific technologies and hubs.
          </p>
          <div class="limitation-box">
            <strong>Zero Safety:</strong> If zero tracked jobs exist for a filter combination, the ratio reports <em>Unavailable</em> rather than division by zero.
          </div>
        </mat-card>
      </section>

      <!-- Freshness Lifecycle Section -->
      <mat-card class="deep-dive-card">
        <h2 class="section-heading">Data Freshness &amp; Verification SLA</h2>
        <p class="section-desc">
          To combat ghost jobs and outdated postings, every active tracked listing is timestamped and categorized into one of three strict tiers:
        </p>

        <div class="tiers-grid">
          <div class="tier-box tier-fresh">
            <div class="tier-header">
              <app-data-freshness-badge status="Fresh"></app-data-freshness-badge>
              <span class="sla-window">&lt; 24 Hours</span>
            </div>
            <h4>Active &amp; Highly Relevant</h4>
            <p>The job posting was imported or actively re-verified within the last 24 hours. Highest probability of being actively interviewed.</p>
          </div>

          <div class="tier-box tier-stale">
            <div class="tier-header">
              <app-data-freshness-badge status="Stale"></app-data-freshness-badge>
              <span class="sla-window">24 &ndash; 72 Hours</span>
            </div>
            <h4>Awaiting SLA Re-Verification</h4>
            <p>The posting was verified between 24 and 72 hours ago. May still be open, but scheduled for platform re-verification.</p>
          </div>

          <div class="tier-box tier-expired">
            <div class="tier-header">
              <app-data-freshness-badge status="Expired"></app-data-freshness-badge>
              <span class="sla-window">&gt; 72 Hours</span>
            </div>
            <h4>Archived / Not Confirmed</h4>
            <p>No verification has succeeded in over 72 hours. Listings in this state are excluded from active dashboard pressure calculations.</p>
          </div>
        </div>
      </mat-card>

      <!-- Historical Snapshot Methodology -->
      <mat-card class="deep-dive-card">
        <h2 class="section-heading">Historical Trend Snapshots</h2>
        <p class="section-desc">
          Trend charts are built entirely from immutable daily <code>MarketSnapshot</code> database rows taken at regular midnight UTC intervals.
        </p>
        <div class="rules-list">
          <div class="rule-item">
            <mat-icon class="rule-icon">check</mat-icon>
            <div>
              <strong>No Interpolation:</strong> We never backfill or fabricate missing dates. If snapshots were not captured for a time window, the charts clearly display an empty state.
            </div>
          </div>
          <div class="rule-item">
            <mat-icon class="rule-icon">check</mat-icon>
            <div>
              <strong>Immutable Auditing:</strong> Each CSV import records an audit batch capturing processed rows, duplicate rows, and validation errors for complete accountability.
            </div>
          </div>
          <div class="rule-item">
            <mat-icon class="rule-icon">check</mat-icon>
            <div>
              <strong>Source Transparency:</strong> All responses expose <code>dataSource</code> and <code>dataType</code> metadata so downstream consumers know the provenance of every data point.
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .methodology-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .mission-banner {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      padding: 1.75rem;
      background: linear-gradient(135deg, var(--jp-brand-subtle) 0%, var(--jp-bg-surface) 100%);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      box-shadow: var(--jp-shadow-sm);

      .banner-icon {
        color: var(--jp-brand-primary);
        font-size: 36px;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
      }

      .banner-text {
        h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: var(--jp-text-primary);
        }

        p {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--jp-text-secondary);
          margin: 0;
        }
      }
    }

    .principles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;

      @media (min-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .principle-card {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      box-shadow: var(--jp-shadow-sm);

      .card-icon {
        width: 44px;
        height: 44px;
        border-radius: var(--jp-radius-sm);
        background-color: var(--jp-brand-subtle);
        color: var(--jp-brand-primary);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      .card-title {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
        color: var(--jp-text-primary);
      }

      .card-text {
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--jp-text-secondary);
        margin: 0;
        flex: 1;

        code {
          background-color: var(--jp-bg-subtle);
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.8125rem;
        }
      }

      .limitation-box {
        margin-top: 0.5rem;
        padding: 0.75rem;
        background-color: var(--jp-bg-subtle);
        border-radius: var(--jp-radius-sm);
        font-size: 0.78125rem;
        color: var(--jp-text-muted);
        line-height: 1.4;

        strong {
          color: var(--jp-text-secondary);
        }
      }
    }

    .deep-dive-card {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: var(--jp-shadow-sm);

      .section-heading {
        font-size: 1.35rem;
        font-weight: 700;
        margin: 0;
        color: var(--jp-text-primary);
      }

      .section-desc {
        font-size: 0.9375rem;
        line-height: 1.5;
        color: var(--jp-text-secondary);
        margin: 0;
      }
    }

    .tiers-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }

      .tier-box {
        padding: 1.25rem;
        border-radius: var(--jp-radius-md);
        border: 1px solid var(--jp-border-color);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .tier-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .sla-window {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--jp-text-muted);
          }
        }

        h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--jp-text-primary);
        }

        p {
          margin: 0;
          font-size: 0.84375rem;
          line-height: 1.5;
          color: var(--jp-text-secondary);
        }

        &.tier-fresh { border-top: 4px solid var(--jp-success); }
        &.tier-stale { border-top: 4px solid var(--jp-warning); }
        &.tier-expired { border-top: 4px solid var(--jp-danger); }
      }
    }

    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;

      .rule-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--jp-text-secondary);

        .rule-icon {
          color: var(--jp-success);
          font-size: 18px;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        code {
          background-color: var(--jp-bg-subtle);
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.8125rem;
        }
      }
    }
  `]
})
export class MethodologyComponent {}
