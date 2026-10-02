import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { JobService } from '../../core/services/job.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';
import { JobListItemDto, JobListQuery, JobListResponse } from '../../core/models/job.model';
import { AppError } from '../../core/models/api-error.model';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { FilterOption, FilterSelectComponent } from '../../shared/components/filter-select/filter-select.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { DataFreshnessBadgeComponent } from '../../shared/components/data-freshness-badge/data-freshness-badge.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    PageHeaderComponent,
    FilterSelectComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent
  ],
  template: `
    <div class="jobs-page">
      <app-page-header
        title="Explore Tracked Job Openings"
        subtitle="Search and inspect verified tech openings across Indian hubs. All listings are server-validated and continuously refreshed."
        badge="Platform Tracked"
      >
        <div actions class="header-actions">
          <a mat-stroked-button routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
        </div>
      </app-page-header>

      <!-- Scope Notice -->
      <div class="notice-card">
        <mat-icon class="notice-icon">info</mat-icon>
        <div class="notice-text">
          <strong>Tracking Scope:</strong> Results reflect openings imported from verified partner feeds and job portals. Tracked openings do not cover all open positions nationwide.
        </div>
      </div>

      <!-- Filter and Search Toolbar -->
      <div class="filter-card">
        <div class="search-box">
          <mat-form-field appearance="outline" density="compact" class="search-field">
            <mat-label>Search job titles</mat-label>
            <input
              matInput
              [(ngModel)]="searchQuery"
              (keyup.enter)="applyFilters()"
              placeholder="e.g. .NET Core, Full Stack, Lead Architect"
            />
            @if (searchQuery) {
              <button matSuffix mat-icon-button (click)="searchQuery = ''; applyFilters()" aria-label="Clear search">
                <mat-icon>clear</mat-icon>
              </button>
            }
          </mat-form-field>

          <button mat-flat-button color="primary" (click)="applyFilters()" class="search-btn">
            <mat-icon>search</mat-icon>
            <span>Search</span>
          </button>
        </div>

        <div class="dropdown-filters">
          <app-filter-select
            label="Technology"
            [options]="techOptions()"
            [selectedValue]="selectedTechnology()"
            (selectionChange)="onTechSelected($event)"
            (clear)="onTechSelected(null)"
          ></app-filter-select>

          <app-filter-select
            label="Location"
            [options]="locationOptions()"
            [selectedValue]="selectedLocation()"
            (selectionChange)="onLocationSelected($event)"
            (clear)="onLocationSelected(null)"
          ></app-filter-select>

          @if (hasActiveFilters()) {
            <button mat-stroked-button color="warn" (click)="resetAllFilters()" class="reset-btn">
              <mat-icon>filter_alt_off</mat-icon>
              <span>Reset Filters</span>
            </button>
          }
        </div>
      </div>

      <!-- Results Section -->
      @if (isLoading()) {
        <app-loading-skeleton type="table" [rows]="6"></app-loading-skeleton>
      } @else if (errorMessage()) {
        <app-error-state
          title="Failed to retrieve jobs"
          [message]="errorMessage()!"
          (retry)="loadJobs()"
        ></app-error-state>
      } @else if (!jobsData() || jobsData()!.items.length === 0) {
        <app-empty-state
          icon="work_outline"
          title="No Matching Openings Found"
          message="No active job listings match your current search and filter criteria. Try broadening your keywords or removing filters."
          actionLabel="Clear Filters"
          actionIcon="filter_alt_off"
          (actionClick)="resetAllFilters()"
        ></app-empty-state>
      } @else {
        <!-- Results Summary & Paginator Header -->
        <div class="results-meta">
          <span class="count-tag">
            Showing <strong>{{ ((currentPage() - 1) * pageSize()) + 1 }}</strong> &ndash;
            <strong>{{ mathMin(currentPage() * pageSize(), jobsData()!.totalCount) }}</strong>
            of <strong>{{ jobsData()!.totalCount }}</strong> tracked openings
          </span>
        </div>

        <!-- Desktop Table View -->
        <div class="table-container desktop-only">
          <table mat-table [dataSource]="jobsData()!.items" class="jobs-table">
            <!-- Title & Company -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Job Title &amp; Company</th>
              <td mat-cell *matCellDef="let job">
                <div class="job-title-cell">
                  <a [routerLink]="['/jobs', job.id]" class="job-link">{{ job.title }}</a>
                  <span class="company-name">{{ job.companyName }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Technology -->
            <ng-container matColumnDef="technology">
              <th mat-header-cell *matHeaderCellDef>Technology</th>
              <td mat-cell *matCellDef="let job">
                <span class="tech-chip">{{ job.technology }}</span>
              </td>
            </ng-container>

            <!-- Location -->
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Location</th>
              <td mat-cell *matCellDef="let job">
                <span class="loc-text">
                  <mat-icon class="inline-icon">place</mat-icon>
                  {{ job.location }}
                </span>
              </td>
            </ng-container>

            <!-- Experience -->
            <ng-container matColumnDef="experience">
              <th mat-header-cell *matHeaderCellDef>Experience</th>
              <td mat-cell *matCellDef="let job">
                <span class="exp-text">{{ job.experienceRange }}</span>
              </td>
            </ng-container>

            <!-- Source -->
            <ng-container matColumnDef="source">
              <th mat-header-cell *matHeaderCellDef>Source</th>
              <td mat-cell *matCellDef="let job">
                <span class="source-tag">{{ job.source }}</span>
              </td>
            </ng-container>

            <!-- Collected / Freshness -->
            <ng-container matColumnDef="collected">
              <th mat-header-cell *matHeaderCellDef>Collected Date</th>
              <td mat-cell *matCellDef="let job">
                <span class="date-text">{{ job.collectedAtUtc | date:'mediumDate' }}</span>
              </td>
            </ng-container>

            <!-- Actions -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Action</th>
              <td mat-cell *matCellDef="let job">
                <a mat-stroked-button color="primary" [routerLink]="['/jobs', job.id]" class="details-btn">
                  <span>Details</span>
                  <mat-icon>chevron_right</mat-icon>
                </a>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="job-row"></tr>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-cards mobile-only">
          @for (job of jobsData()!.items; track job.id) {
            <mat-card class="job-mobile-card">
              <div class="mobile-header">
                <div class="tech-source-row">
                  <span class="tech-chip">{{ job.technology }}</span>
                  <span class="source-tag">{{ job.source }}</span>
                </div>
                <h3 class="mobile-job-title">
                  <a [routerLink]="['/jobs', job.id]">{{ job.title }}</a>
                </h3>
                <span class="company-name">{{ job.companyName }}</span>
              </div>

              <div class="mobile-details">
                <div class="detail-item">
                  <mat-icon class="detail-icon">place</mat-icon>
                  <span>{{ job.location }}</span>
                </div>
                <div class="detail-item">
                  <mat-icon class="detail-icon">work_history</mat-icon>
                  <span>{{ job.experienceRange }}</span>
                </div>
                <div class="detail-item">
                  <mat-icon class="detail-icon">calendar_today</mat-icon>
                  <span>{{ job.collectedAtUtc | date:'mediumDate' }}</span>
                </div>
              </div>

              <div class="mobile-actions">
                <a mat-flat-button color="primary" [routerLink]="['/jobs', job.id]" class="full-btn">
                  <span>View Details &amp; Freshness</span>
                  <mat-icon>arrow_forward</mat-icon>
                </a>
              </div>
            </mat-card>
          }
        </div>

        <!-- Paginator -->
        <div class="paginator-card">
          <mat-paginator
            [length]="jobsData()!.totalCount"
            [pageSize]="pageSize()"
            [pageIndex]="currentPage() - 1"
            [pageSizeOptions]="[10, 20, 50]"
            (page)="onPageChange($event)"
            aria-label="Select page of job openings"
          ></mat-paginator>
        </div>
      }
    </div>
  `,
  styles: [`
    .jobs-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .notice-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      background-color: var(--jp-bg-subtle);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      font-size: 0.84375rem;
      color: var(--jp-text-secondary);

      .notice-icon {
        color: var(--jp-brand-primary);
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
    }

    .filter-card {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: var(--jp-shadow-sm);

      .search-box {
        display: flex;
        gap: 0.75rem;
        align-items: center;

        .search-field {
          flex: 1;
          margin-bottom: -1.25em;
        }

        .search-btn {
          height: 48px;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
        }
      }

      .dropdown-filters {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;

        .reset-btn {
          height: 40px;
        }
      }
    }

    .results-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.25rem;

      .count-tag {
        font-size: 0.875rem;
        color: var(--jp-text-muted);

        strong {
          color: var(--jp-text-primary);
        }
      }
    }

    .table-container {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      overflow-x: auto;
      box-shadow: var(--jp-shadow-sm);

      .jobs-table {
        width: 100%;
        background-color: transparent;

        th.mat-header-cell {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--jp-text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid var(--jp-border-color);
          padding: 1rem 1.25rem;
        }

        td.mat-cell {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--jp-border-subtle);
          font-size: 0.875rem;
        }

        .job-row:hover {
          background-color: var(--jp-bg-surface-hover);
        }

        .job-title-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;

          .job-link {
            font-weight: 600;
            color: var(--jp-text-primary);
            text-decoration: none;

            &:hover {
              color: var(--jp-brand-primary);
              text-decoration: underline;
            }
          }

          .company-name {
            font-size: 0.8125rem;
            color: var(--jp-text-muted);
          }
        }

        .tech-chip {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: var(--jp-radius-sm);
          background-color: var(--jp-brand-subtle);
          color: var(--jp-brand-text);
        }

        .loc-text {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--jp-text-secondary);

          .inline-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: var(--jp-text-muted);
          }
        }

        .exp-text, .date-text {
          color: var(--jp-text-secondary);
        }

        .source-tag {
          font-size: 0.75rem;
          padding: 0.15rem 0.45rem;
          border-radius: var(--jp-radius-sm);
          background-color: var(--jp-bg-subtle);
          color: var(--jp-text-muted);
        }

        .details-btn {
          font-size: 0.8125rem;
        }
      }
    }

    .mobile-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .job-mobile-card {
        padding: 1.25rem;
        background-color: var(--jp-bg-surface);
        border: 1px solid var(--jp-border-color);
        border-radius: var(--jp-radius-md);
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .tech-source-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .mobile-job-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;

          a {
            color: var(--jp-text-primary);
            text-decoration: none;
          }
        }

        .company-name {
          font-size: 0.875rem;
          color: var(--jp-text-muted);
        }

        .mobile-details {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          padding: 0.75rem 0;
          border-top: 1px solid var(--jp-border-subtle);
          border-bottom: 1px solid var(--jp-border-subtle);

          .detail-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.84375rem;
            color: var(--jp-text-secondary);

            .detail-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
              color: var(--jp-text-muted);
            }
          }
        }

        .full-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
      }
    }

    .paginator-card {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      overflow: hidden;
    }

    @media (min-width: 801px) {
      .mobile-only {
        display: none !important;
      }
    }

    @media (max-width: 800px) {
      .desktop-only {
        display: none !important;
      }
    }
  `]
})
export class JobsComponent implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly techService = inject(TechnologyService);
  private readonly locService = inject(LocationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayedColumns: string[] = ['title', 'technology', 'location', 'experience', 'source', 'collected', 'actions'];

  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly jobsData = signal<JobListResponse | null>(null);

  readonly techOptions = signal<FilterOption[]>([]);
  readonly locationOptions = signal<FilterOption[]>([]);

  searchQuery = '';
  readonly selectedTechnology = signal<string | null>(null);
  readonly selectedLocation = signal<string | null>(null);
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(20);

  ngOnInit(): void {
    this.loadFilterOptions();

    // Read initial query parameters from URL
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.searchQuery = params.get('search') || '';
      this.selectedTechnology.set(params.get('technology') || null);
      this.selectedLocation.set(params.get('location') || null);
      const page = parseInt(params.get('page') || '1', 10);
      this.currentPage.set(isNaN(page) || page < 1 ? 1 : page);
      const size = parseInt(params.get('pageSize') || '20', 10);
      this.pageSize.set(isNaN(size) || size < 1 ? 20 : size);

      this.loadJobs();
    });
  }

  loadFilterOptions(): void {
    this.techService.getTechnologies().subscribe({
      next: (techs) => {
        this.techOptions.set(techs.map(t => ({ id: t.name, label: t.name })));
      },
      error: () => {}
    });

    this.locService.getLocations().subscribe({
      next: (locs) => {
        this.locationOptions.set(locs.map(l => ({ id: l.city, label: `${l.city}${l.state ? ', ' + l.state : ''}` })));
      },
      error: () => {}
    });
  }

  loadJobs(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const query: JobListQuery = {
      pageNumber: this.currentPage(),
      pageSize: this.pageSize()
    };

    if (this.searchQuery.trim()) {
      query.search = this.searchQuery.trim();
    }
    if (this.selectedTechnology()) {
      query.technology = this.selectedTechnology()!;
    }
    if (this.selectedLocation()) {
      query.location = this.selectedLocation()!;
    }

    this.jobService.getJobs(query).subscribe({
      next: (response) => {
        this.jobsData.set(response);
        this.isLoading.set(false);
      },
      error: (err: AppError | Error) => {
        const msg = 'message' in err ? err.message : 'Failed to retrieve job listings.';
        this.errorMessage.set(msg);
        this.isLoading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.updateUrlParams();
  }

  onTechSelected(tech: string | null): void {
    this.selectedTechnology.set(tech);
    this.applyFilters();
  }

  onLocationSelected(loc: string | null): void {
    this.selectedLocation.set(loc);
    this.applyFilters();
  }

  resetAllFilters(): void {
    this.searchQuery = '';
    this.selectedTechnology.set(null);
    this.selectedLocation.set(null);
    this.currentPage.set(1);
    this.updateUrlParams();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery.trim() || this.selectedTechnology() || this.selectedLocation());
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.updateUrlParams();
  }

  updateUrlParams(): void {
    const queryParams: Record<string, string | number | null> = {};
    if (this.searchQuery.trim()) queryParams['search'] = this.searchQuery.trim();
    if (this.selectedTechnology()) queryParams['technology'] = this.selectedTechnology();
    if (this.selectedLocation()) queryParams['location'] = this.selectedLocation();
    if (this.currentPage() > 1) queryParams['page'] = this.currentPage();
    if (this.pageSize() !== 20) queryParams['pageSize'] = this.pageSize();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: ''
    });
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
