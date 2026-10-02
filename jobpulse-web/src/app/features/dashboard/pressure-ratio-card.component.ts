import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DashboardService } from '../../core/services/dashboard.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';
import { JobMarketPressureRatioQuery, JobMarketPressureRatioResponse } from '../../core/models/dashboard.model';
import { AppError } from '../../core/models/api-error.model';
import { FilterOption, FilterSelectComponent } from '../../shared/components/filter-select/filter-select.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-pressure-ratio-card',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FilterSelectComponent,
    LoadingSkeletonComponent
  ],
  template: `
    <mat-card class="pressure-card">
      <div class="card-header">
        <div class="header-info">
          <div class="badge-title">
            <span class="pill-badge">Market Intelligence</span>
            <span class="source-tag">Source: platform_tracked</span>
          </div>
          <h2 class="title">Job Market Pressure Ratio</h2>
          <p class="description">
            Ratio of Active Registered Job Seekers to Active Tracked Openings. Higher values indicate higher competition per opening.
          </p>
        </div>

        <div class="filter-toolbar">
          <app-filter-select
            label="Technology"
            [options]="techOptions()"
            [selectedValue]="selectedTechId()"
            (selectionChange)="onTechChange($event)"
            (clear)="onTechChange(null)"
          ></app-filter-select>

          <app-filter-select
            label="Location"
            [options]="locOptions()"
            [selectedValue]="selectedLocId()"
            (selectionChange)="onLocChange($event)"
            (clear)="onLocChange(null)"
          ></app-filter-select>

          @if (selectedTechId() || selectedLocId()) {
            <button mat-stroked-button color="warn" (click)="resetFilters()" class="reset-btn">
              <mat-icon>filter_alt_off</mat-icon>
              <span>Reset</span>
            </button>
          }
        </div>
      </div>

      <div class="card-content">
        @if (isLoading()) {
          <app-loading-skeleton type="card"></app-loading-skeleton>
        } @else if (error()) {
          <div class="error-notice" role="alert">
            <mat-icon class="err-icon">error_outline</mat-icon>
            <div class="err-body">
              <span>{{ error() }}</span>
              <button mat-stroked-button color="primary" (click)="loadRatio()" class="retry-btn">
                <mat-icon>refresh</mat-icon>
                <span>Retry</span>
              </button>
            </div>
          </div>
        } @else if (ratioData()) {
          <div class="metrics-display">
            <!-- Large ratio highlight -->
            <div class="ratio-highlight">
              <div class="ratio-value-wrap">
                @if (ratioData()!.isAvailable && ratioData()!.ratio !== null) {
                  <span class="ratio-number">{{ ratioData()!.ratio | number:'1.2-2' }}</span>
                  <span class="ratio-unit">seekers / opening</span>
                } @else {
                  <span class="ratio-unavailable">Unavailable</span>
                }
              </div>

              @if (!ratioData()!.isAvailable && ratioData()!.metadata.unavailableReason) {
                <div class="reason-banner">
                  <mat-icon>info</mat-icon>
                  <span>{{ ratioData()!.metadata.unavailableReason }}</span>
                </div>
              }
            </div>

            <!-- Supporting sample counts -->
            <div class="sample-counts">
              <div class="sample-item">
                <div class="sample-label">
                  <mat-icon class="sample-icon">person</mat-icon>
                  <span>Active Seekers</span>
                </div>
                <div class="sample-value">
                  {{ ratioData()!.sampleSize.activeRegisteredJobSeekers | number }}
                </div>
                <div class="sample-sub">Platform registered</div>
              </div>

              <div class="sample-divider">&divide;</div>

              <div class="sample-item">
                <div class="sample-label">
                  <mat-icon class="sample-icon">work</mat-icon>
                  <span>Tracked Openings</span>
                </div>
                <div class="sample-value">
                  {{ ratioData()!.sampleSize.activeTrackedJobListings | number }}
                </div>
                <div class="sample-sub">Verified active</div>
              </div>
            </div>
          </div>

          <div class="ratio-footer">
            <mat-icon class="footer-icon">verified</mat-icon>
            <span class="methodology-note">
              <strong>Calculation:</strong> Active Registered Seekers / Active Tracked Listings. Reflects JobPulse platform sample, not national census data.
            </span>
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: [`
    .pressure-card {
      background: linear-gradient(135deg, var(--jp-bg-surface) 0%, var(--jp-bg-subtle) 100%);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      box-shadow: var(--jp-shadow-sm);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      flex-wrap: wrap;

      .header-info {
        flex: 1;
        min-width: 280px;

        .badge-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;

          .pill-badge {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.2rem 0.5rem;
            border-radius: 9999px;
            background-color: var(--jp-brand-subtle);
            color: var(--jp-brand-text);
          }

          .source-tag {
            font-size: 0.7rem;
            color: var(--jp-text-muted);
            font-family: monospace;
          }
        }

        .title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--jp-text-primary);
          margin: 0 0 0.35rem 0;
          letter-spacing: -0.02em;
        }

        .description {
          font-size: 0.84375rem;
          color: var(--jp-text-muted);
          margin: 0;
          max-width: 600px;
          line-height: 1.4;
        }
      }

      .filter-toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;

        .reset-btn {
          height: 40px;
        }
      }
    }

    .metrics-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
      padding: 1.25rem;
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);

      .ratio-highlight {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .ratio-value-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;

          .ratio-number {
            font-size: 2.75rem;
            font-weight: 800;
            color: var(--jp-brand-primary);
            line-height: 1;
          }

          .ratio-unit {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--jp-text-muted);
          }

          .ratio-unavailable {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--jp-text-disabled);
          }
        }

        .reason-banner {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--jp-warning);

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .sample-counts {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .sample-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;

          .sample-label {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.78125rem;
            font-weight: 600;
            color: var(--jp-text-secondary);

            .sample-icon {
              font-size: 14px;
              width: 14px;
              height: 14px;
              color: var(--jp-brand-primary);
            }
          }

          .sample-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--jp-text-primary);
            line-height: 1.1;
          }

          .sample-sub {
            font-size: 0.7rem;
            color: var(--jp-text-muted);
          }
        }

        .sample-divider {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--jp-text-disabled);
        }
      }
    }

    .ratio-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78125rem;
      color: var(--jp-text-muted);

      .footer-icon {
        color: var(--jp-brand-primary);
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .error-notice {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background-color: var(--jp-danger-bg);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);

      .err-icon {
        color: var(--jp-danger);
        font-size: 28px;
        width: 28px;
        height: 28px;
        flex-shrink: 0;
      }

      .err-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex: 1;
        flex-wrap: wrap;
        font-size: 0.875rem;
        color: var(--jp-danger);

        .retry-btn {
          height: 36px;
        }
      }
    }
  `]
})
export class PressureRatioCardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly techService = inject(TechnologyService);
  private readonly locService = inject(LocationService);

  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly ratioData = signal<JobMarketPressureRatioResponse | null>(null);

  readonly techOptions = signal<FilterOption[]>([]);
  readonly locOptions = signal<FilterOption[]>([]);

  readonly selectedTechId = signal<string | null>(null);
  readonly selectedLocId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadRatio();
  }

  loadFilterOptions(): void {
    this.techService.getTechnologies().subscribe({
      next: (techs) => {
        this.techOptions.set(techs.map(t => ({ id: t.id, label: t.name })));
      },
      error: () => {}
    });

    this.locService.getLocations().subscribe({
      next: (locs) => {
        this.locOptions.set(locs.map(l => ({ id: l.id, label: `${l.city}${l.state ? ', ' + l.state : ''}` })));
      },
      error: () => {}
    });
  }

  loadRatio(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const query: JobMarketPressureRatioQuery = {};
    if (this.selectedTechId()) {
      query.technologyId = this.selectedTechId()!;
    }
    if (this.selectedLocId()) {
      query.locationId = this.selectedLocId()!;
    }

    this.dashboardService.getPressureRatio(query).subscribe({
      next: (response) => {
        this.ratioData.set(response);
        this.isLoading.set(false);
      },
      error: (err: AppError | Error) => {
        const msg = 'message' in err ? err.message : 'Unable to calculate market pressure ratio.';
        this.error.set(msg);
        this.isLoading.set(false);
      }
    });
  }

  onTechChange(techId: string | null): void {
    this.selectedTechId.set(techId);
    this.loadRatio();
  }

  onLocChange(locId: string | null): void {
    this.selectedLocId.set(locId);
    this.loadRatio();
  }

  resetFilters(): void {
    this.selectedTechId.set(null);
    this.selectedLocId.set(null);
    this.loadRatio();
  }
}
