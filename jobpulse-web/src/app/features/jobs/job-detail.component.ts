import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { JobService } from '../../core/services/job.service';
import { JobFreshnessDto, JobListingDto } from '../../core/models/job.model';
import { AppError } from '../../core/models/api-error.model';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DataFreshnessBadgeComponent } from '../../shared/components/data-freshness-badge/data-freshness-badge.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    DataFreshnessBadgeComponent,
    LoadingSkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="job-detail-page">
      <div class="back-nav">
        <a mat-button routerLink="/jobs" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Job Explorer</span>
        </a>
      </div>

      @if (isLoading()) {
        <app-loading-skeleton type="card" [rows]="6"></app-loading-skeleton>
      } @else if (isNotFound()) {
        <app-empty-state
          icon="search_off"
          title="Job Listing Not Found"
          message="The requested opening identifier was not found in our tracked database. It may have expired, been de-indexed, or the link is invalid."
          actionLabel="Browse Active Openings"
          actionIcon="work_outline"
          (actionClick)="navigateJobs()"
        ></app-empty-state>
      } @else if (errorMessage()) {
        <app-error-state
          title="Failed to Load Opening Details"
          [message]="errorMessage()!"
          (retry)="loadDetails()"
        ></app-error-state>
      } @else if (job()) {
        <!-- Job Header Banner -->
        <mat-card class="detail-header-card">
          <div class="header-main-row">
            <div class="title-company-wrap">
              <div class="badges-row">
                <span class="tech-badge">{{ job()!.technology.name }}</span>
                @if (freshness()) {
                  <app-data-freshness-badge
                    [status]="freshness()!.status"
                    [lastSeenAt]="freshness()!.lastSeenAt"
                    [showTimestamp]="true"
                  ></app-data-freshness-badge>
                }
                <span class="quality-badge" [class.valid]="job()!.dataQualityStatus === 'Valid'">
                  Data Quality: {{ job()!.dataQualityStatus }}
                </span>
              </div>

              <h1 class="job-title">{{ job()!.title }}</h1>
              <div class="company-name">
                <mat-icon class="inline-icon">business</mat-icon>
                <span>{{ job()!.companyName }}</span>
              </div>
            </div>

            @if (job()!.jobUrl) {
              <div class="action-wrap">
                <a
                  mat-flat-button
                  color="primary"
                  [href]="job()!.jobUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="apply-btn"
                >
                  <span>Open on Source Feed</span>
                  <mat-icon>open_in_new</mat-icon>
                </a>
              </div>
            }
          </div>

          <!-- Metadata Grid -->
          <div class="metadata-grid">
            <div class="meta-item">
              <span class="meta-label">Location</span>
              <span class="meta-val">
                <mat-icon class="meta-icon">place</mat-icon>
                {{ job()!.location.city }}{{ job()!.location.state ? ', ' + job()!.location.state : '' }}, {{ job()!.location.country }}
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Experience Required</span>
              <span class="meta-val">
                <mat-icon class="meta-icon">work_history</mat-icon>
                {{ job()!.experienceRange }}
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">First Collected</span>
              <span class="meta-val">
                <mat-icon class="meta-icon">event</mat-icon>
                {{ job()!.collectedAtUtc | date:'mediumDate' }}
              </span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Data Feed</span>
              <span class="meta-val">
                <mat-icon class="meta-icon">hub</mat-icon>
                {{ job()!.source.name }}
              </span>
            </div>
          </div>
        </mat-card>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Left Column: Description & Details -->
          <div class="main-column">
            <mat-card class="content-card">
              <h2 class="section-title">Opening Information</h2>

              @if (job()!.description) {
                <div class="description-text">
                  <p>{{ job()!.description }}</p>
                </div>
              } @else {
                <p class="description-placeholder text-muted">
                  No textual description was provided in the source feed. Full details can be reviewed on the original source feed.
                </p>
              }

              <!-- Work Mode & Employment Type -->
              <div class="attributes-grid">
                @if (job()!.workMode) {
                  <div class="attr-box">
                    <span class="attr-label">Work Mode</span>
                    <span class="attr-val">{{ job()!.workMode }}</span>
                  </div>
                }
                @if (job()!.employmentType) {
                  <div class="attr-box">
                    <span class="attr-label">Employment Type</span>
                    <span class="attr-val">{{ job()!.employmentType }}</span>
                  </div>
                }
                @if (job()!.salaryMin !== null && job()!.salaryMin !== undefined) {
                  <div class="attr-box">
                    <span class="attr-label">Compensation Range</span>
                    <span class="attr-val">
                      ₹{{ job()!.salaryMin | number }} &ndash; ₹{{ job()!.salaryMax | number }}
                    </span>
                  </div>
                }
              </div>
            </mat-card>
          </div>

          <!-- Right Column: Verification & Transparency -->
          <div class="side-column">
            <mat-card class="transparency-card">
              <div class="card-head">
                <mat-icon class="shield-icon">verified_user</mat-icon>
                <h3 class="side-title">Verification SLA</h3>
              </div>

              <div class="sla-info">
                @if (freshness()) {
                  <div class="sla-status-item">
                    <span class="label">Freshness Tier:</span>
                    <span class="val font-semibold">{{ freshness()!.status }}</span>
                  </div>
                  <div class="sla-status-item">
                    <span class="label">Last Verified Seen:</span>
                    <span class="val">{{ freshness()!.lastSeenAt | date:'medium' }}</span>
                  </div>
                }
                <div class="sla-status-item">
                  <span class="label">Source Feed:</span>
                  <span class="val">{{ job()!.source.name }}</span>
                </div>
                @if (job()!.sourceIdentifier) {
                  <div class="sla-status-item">
                    <span class="label">Feed Ref ID:</span>
                    <span class="val font-mono">{{ job()!.sourceIdentifier }}</span>
                  </div>
                }
              </div>

              <div class="audit-note">
                <mat-icon class="note-icon">info_outline</mat-icon>
                <span>
                  JobPulse periodically re-verifies tracked job URLs to maintain accurate fresh/stale/expired states.
                </span>
              </div>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .job-detail-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .back-nav {
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        color: var(--jp-text-secondary);
        font-weight: 500;

        &:hover {
          color: var(--jp-brand-primary);
        }
      }
    }

    .detail-header-card {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      box-shadow: var(--jp-shadow-sm);

      .header-main-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.5rem;
        flex-wrap: wrap;

        .title-company-wrap {
          flex: 1;
          min-width: 280px;

          .badges-row {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            margin-bottom: 0.75rem;
            flex-wrap: wrap;

            .tech-badge {
              font-size: 0.75rem;
              font-weight: 700;
              padding: 0.2rem 0.6rem;
              border-radius: var(--jp-radius-sm);
              background-color: var(--jp-brand-subtle);
              color: var(--jp-brand-text);
            }

            .quality-badge {
              font-size: 0.75rem;
              font-weight: 600;
              padding: 0.2rem 0.5rem;
              border-radius: var(--jp-radius-sm);
              background-color: var(--jp-bg-subtle);
              color: var(--jp-text-muted);

              &.valid {
                background-color: var(--jp-success-bg);
                color: var(--jp-success);
              }
            }
          }

          .job-title {
            font-size: 1.85rem;
            font-weight: 700;
            color: var(--jp-text-primary);
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.025em;
            line-height: 1.2;
          }

          .company-name {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 1rem;
            font-weight: 600;
            color: var(--jp-text-secondary);

            .inline-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: var(--jp-brand-primary);
            }
          }
        }

        .action-wrap {
          .apply-btn {
            height: 44px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }
        }
      }

      .metadata-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding-top: 1.25rem;
        border-top: 1px solid var(--jp-border-color);

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          .meta-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--jp-text-muted);
          }

          .meta-val {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.9375rem;
            font-weight: 500;
            color: var(--jp-text-primary);

            .meta-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
              color: var(--jp-brand-primary);
            }
          }
        }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 900px) {
        grid-template-columns: 2fr 1fr;
      }

      .content-card, .transparency-card {
        background-color: var(--jp-bg-surface);
        border: 1px solid var(--jp-border-color);
        border-radius: var(--jp-radius-md);
        padding: 1.5rem;
        box-shadow: var(--jp-shadow-sm);
      }

      .section-title {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        color: var(--jp-text-primary);
      }

      .description-text {
        font-size: 0.9375rem;
        line-height: 1.6;
        color: var(--jp-text-secondary);
        margin-bottom: 1.5rem;
      }

      .attributes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--jp-border-subtle);

        .attr-box {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 0.75rem;
          background-color: var(--jp-bg-subtle);
          border-radius: var(--jp-radius-sm);

          .attr-label {
            font-size: 0.75rem;
            color: var(--jp-text-muted);
          }

          .attr-val {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--jp-text-primary);
          }
        }
      }

      .transparency-card {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;

        .card-head {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          .shield-icon {
            color: var(--jp-brand-primary);
          }

          .side-title {
            font-size: 1.05rem;
            font-weight: 700;
            margin: 0;
            color: var(--jp-text-primary);
          }
        }

        .sla-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;

          .sla-status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.84375rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--jp-border-subtle);

            .label {
              color: var(--jp-text-muted);
            }

            .val {
              color: var(--jp-text-primary);
            }

            .font-mono {
              font-family: monospace;
              font-size: 0.75rem;
            }
          }
        }

        .audit-note {
          display: flex;
          gap: 0.5rem;
          font-size: 0.78125rem;
          color: var(--jp-text-muted);
          line-height: 1.4;

          .note-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            color: var(--jp-brand-primary);
          }
        }
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal<boolean>(true);
  readonly isNotFound = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly job = signal<JobListingDto | null>(null);
  readonly freshness = signal<JobFreshnessDto | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadDetails(id);
      } else {
        this.isNotFound.set(true);
        this.isLoading.set(false);
      }
    });
  }

  loadDetails(id?: string): void {
    const jobId = id || this.route.snapshot.paramMap.get('id');
    if (!jobId) {
      this.isNotFound.set(true);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.isNotFound.set(false);
    this.errorMessage.set(null);

    forkJoin({
      job: this.jobService.getJobById(jobId).pipe(
        catchError((err: AppError) => {
          if (err.status === 404) {
            this.isNotFound.set(true);
          } else {
            this.errorMessage.set(err.message);
          }
          return of(null);
        })
      ),
      freshness: this.jobService.getFreshness(jobId).pipe(
        catchError(() => of(null))
      )
    }).subscribe({
      next: ({ job, freshness }) => {
        this.job.set(job);
        this.freshness.set(freshness);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  navigateJobs(): void {
    this.router.navigate(['/jobs']);
  }
}
