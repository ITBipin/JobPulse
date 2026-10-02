import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { JobSeekerService } from '../../core/services/job-seeker.service';
import { TechnologyService } from '../../core/services/technology.service';
import { LocationService } from '../../core/services/location.service';
import { ExperienceRangeService } from '../../core/services/experience-range.service';
import { ExperienceRangeOption } from '../../core/models/experience-range.model';
import {
  ActiveJobSeekerCountResponse,
  JobSeekerRegistrationResponse,
  JobSeekerStatusUpdateResponse,
  RegisterJobSeekerRequest,
  UpdateJobSeekerStatusRequest
} from '../../core/models/job-seeker.model';
import { TechnologyDto } from '../../core/models/technology.model';
import { LocationDto } from '../../core/models/location.model';
import { AppError } from '../../core/models/api-error.model';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-job-seekers',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    PageHeaderComponent
  ],
  template: `
    <div class="job-seekers-page">
      <app-page-header
        title="Voluntary Candidate Portal"
        subtitle="Participate anonymously in India tech supply analytics. We collect zero personally identifiable information."
        badge="Privacy-Preserving"
      ></app-page-header>

      <!-- Active Seeker Count Metric Banner -->
      <div class="active-count-banner">
        <div class="banner-left">
          <div class="stat-circle">
            <mat-icon>people</mat-icon>
          </div>
          <div>
            <div class="stat-val">
              @if (activeCountData()) {
                {{ activeCountData()!.count | number }}
              } @else {
                <span>--</span>
              }
            </div>
            <div class="stat-label">Active Registered Job Seekers</div>
          </div>
        </div>

        <div class="banner-right">
          <mat-icon class="shield-icon">privacy_tip</mat-icon>
          <span class="privacy-text">
            <strong>Voluntary &amp; Anonymous:</strong> Represents JobPulse registered candidates only, not the total number of job seekers in India. No resumes, names, or contact numbers are collected.
          </span>
        </div>
      </div>

      <!-- Main Tabs: Register vs Update Status -->
      <mat-card class="portal-card">
        <mat-tab-group animationDuration="200ms">
          <!-- Tab 1: Registration Form -->
          <mat-tab label="Voluntary Registration">
            <div class="tab-content">
              @if (registrationSuccess()) {
                <div class="success-banner" role="status">
                  <mat-icon class="success-icon">check_circle</mat-icon>
                  <div class="success-text">
                    <h3>Registration Successfully Recorded!</h3>
                    <p>Status: <strong>{{ registrationResult()?.status }}</strong> &bull; Recorded At: {{ registrationResult()?.registeredAtUtc | date:'medium' }}</p>
                    <p class="sub-msg">Thank you for contributing to open, transparent tech hiring intelligence in India.</p>
                  </div>
                  <button mat-stroked-button (click)="resetRegistrationForm()" class="register-again-btn">
                    Register Another
                  </button>
                </div>
              } @else {
                <form [formGroup]="registerForm" (ngSubmit)="submitRegistration()" class="form-layout">
                  @if (isSubmitting()) {
                    <mat-progress-bar mode="indeterminate" class="form-progress"></mat-progress-bar>
                  }

                  @if (submitError()) {
                    <div class="error-banner" role="alert">
                      <mat-icon>error_outline</mat-icon>
                      <span>{{ submitError() }}</span>
                    </div>
                  }

                  <div class="form-grid">
                    <!-- Location Selection -->
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Primary Preferred Hub (City)</mat-label>
                      <mat-select formControlName="locationId" placeholder="Select your location">
                        @for (loc of locations(); track loc.id) {
                          <mat-option [value]="loc.id">
                            {{ loc.city }}{{ loc.state ? ', ' + loc.state : '' }}
                          </mat-option>
                        }
                      </mat-select>
                      @if (registerForm.get('locationId')?.hasError('required') && registerForm.get('locationId')?.touched) {
                        <mat-error>Preferred location is required</mat-error>
                      }
                    </mat-form-field>

                    <!-- Experience Tier -->
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Experience Range</mat-label>
                      <mat-select formControlName="experienceRangeId" placeholder="Select experience range">
                        @for (tier of experienceTiers(); track tier.id) {
                          <mat-option [value]="tier.id">{{ tier.label }}</mat-option>
                        }
                      </mat-select>
                      @if (registerForm.get('experienceRangeId')?.hasError('required') && registerForm.get('experienceRangeId')?.touched) {
                        <mat-error>Experience range is required</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <!-- Primary Skills / Technologies -->
                  <div class="full-field">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Primary Technologies / Core Skills</mat-label>
                      <mat-select formControlName="technologyIds" multiple placeholder="Select skills in your stack">
                        @for (tech of technologies(); track tech.id) {
                          <mat-option [value]="tech.id">{{ tech.name }}</mat-option>
                        }
                      </mat-select>
                      @if (registerForm.get('technologyIds')?.hasError('required') && registerForm.get('technologyIds')?.touched) {
                        <mat-error>Select at least 1 technology</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <div class="form-grid">
                    <!-- Job Search Status -->
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Current Search Status</mat-label>
                      <mat-select formControlName="jobSearchStatus">
                        <mat-option value="OpenToWork">Open to Work (Actively Seeking)</mat-option>
                        <mat-option value="NotLooking">Not Looking (Currently Content)</mat-option>
                        <mat-option value="Hired">Recently Hired</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <!-- Job Search Start Date -->
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Job Search Start Date (Optional)</mat-label>
                      <input matInput type="date" formControlName="jobSearchStartDate" />
                    </mat-form-field>
                  </div>

                  <!-- Salary Expectations (Optional) -->
                  <div class="form-grid">
                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Min Annual Target (₹ CTC, Optional)</mat-label>
                      <input matInput type="number" formControlName="salaryMin" placeholder="e.g. 1200000" />
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="form-field">
                      <mat-label>Max Annual Target (₹ CTC, Optional)</mat-label>
                      <input matInput type="number" formControlName="salaryMax" placeholder="e.g. 1800000" />
                    </mat-form-field>
                  </div>

                  <!-- Consent Checkbox -->
                  <div class="consent-box">
                    <mat-checkbox formControlName="consent" color="primary">
                      <span>I voluntarily submit this anonymous profile to contribute to JobPulse India job market intelligence analytics.</span>
                    </mat-checkbox>
                    @if (registerForm.get('consent')?.hasError('requiredTrue') && registerForm.get('consent')?.touched) {
                      <div class="consent-error">Explicit consent is required to register.</div>
                    }
                  </div>

                  <!-- Form Action Buttons -->
                  <div class="form-actions">
                    <button
                      mat-flat-button
                      color="primary"
                      type="submit"
                      [disabled]="registerForm.invalid || isSubmitting()"
                      class="submit-btn"
                    >
                      <mat-icon>check</mat-icon>
                      <span>Submit Voluntary Registration</span>
                    </button>
                  </div>
                </form>
              }
            </div>
          </mat-tab>

          <!-- Tab 2: Status Management -->
          <mat-tab label="Update Candidate Status">
            <div class="tab-content">
              <div class="tab-intro">
                <h3>Refresh or Change Your Status</h3>
                <p class="text-muted">
                  If you have registered on JobPulse and wish to transition between OpenToWork, NotLooking, or Hired, enter your registration ID below.
                </p>
              </div>

              @if (statusUpdateSuccess()) {
                <div class="success-banner" role="status">
                  <mat-icon class="success-icon">verified</mat-icon>
                  <div class="success-text">
                    <h3>Status Updated Successfully!</h3>
                    <p>New Status: <strong>{{ statusUpdateResult()?.status }}</strong> &bull; Confirmed: {{ statusUpdateResult()?.lastConfirmedAt | date:'medium' }}</p>
                  </div>
                </div>
              }

              <form [formGroup]="statusForm" (ngSubmit)="submitStatusUpdate()" class="form-layout">
                @if (isUpdatingStatus()) {
                  <mat-progress-bar mode="indeterminate" class="form-progress"></mat-progress-bar>
                }

                @if (statusError()) {
                  <div class="error-banner" role="alert">
                    <mat-icon>error_outline</mat-icon>
                    <span>{{ statusError() }}</span>
                  </div>
                }

                <div class="form-grid">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Job Seeker Identifier (GUID)</mat-label>
                    <input matInput formControlName="jobSeekerId" placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6" />
                    @if (statusForm.get('jobSeekerId')?.hasError('required') && statusForm.get('jobSeekerId')?.touched) {
                      <mat-error>Job seeker identifier is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>New Search Status</mat-label>
                    <mat-select formControlName="status">
                      <mat-option value="OpenToWork">Open to Work</mat-option>
                      <mat-option value="NotLooking">Not Looking</mat-option>
                      <mat-option value="Hired">Hired</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-actions">
                  <button
                    mat-flat-button
                    color="primary"
                    type="submit"
                    [disabled]="statusForm.invalid || isUpdatingStatus()"
                    class="submit-btn"
                  >
                    <mat-icon>sync</mat-icon>
                    <span>Update Status</span>
                  </button>
                </div>
              </form>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .job-seekers-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .active-count-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      padding: 1.25rem 1.75rem;
      background: linear-gradient(135deg, var(--jp-brand-subtle) 0%, var(--jp-bg-surface) 100%);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      box-shadow: var(--jp-shadow-sm);
      flex-wrap: wrap;

      .banner-left {
        display: flex;
        align-items: center;
        gap: 1rem;

        .stat-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--jp-brand-primary);
          color: #ffffff;

          mat-icon {
            font-size: 26px;
            width: 26px;
            height: 26px;
          }
        }

        .stat-val {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--jp-text-primary);
          line-height: 1.1;
        }

        .stat-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--jp-brand-text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .banner-right {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        max-width: 540px;
        font-size: 0.8125rem;
        color: var(--jp-text-secondary);
        line-height: 1.4;

        .shield-icon {
          color: var(--jp-brand-primary);
          font-size: 22px;
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
      }
    }

    .portal-card {
      background-color: var(--jp-bg-surface);
      border: 1px solid var(--jp-border-color);
      border-radius: var(--jp-radius-md);
      box-shadow: var(--jp-shadow-sm);
      overflow: hidden;

      .tab-content {
        padding: 2rem 1.5rem;
      }

      .tab-intro {
        margin-bottom: 1.5rem;

        h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 0.35rem 0;
          color: var(--jp-text-primary);
        }
      }
    }

    .form-layout {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-width: 800px;

      .form-progress {
        position: absolute;
        top: -2rem;
        left: -1.5rem;
        right: -1.5rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media (min-width: 640px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      .full-width {
        width: 100%;
      }

      .consent-box {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.875rem 1rem;
        background-color: var(--jp-bg-subtle);
        border-radius: var(--jp-radius-sm);
        border: 1px solid var(--jp-border-subtle);

        .consent-error {
          font-size: 0.75rem;
          color: var(--jp-danger);
          padding-left: 28px;
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-start;
        padding-top: 0.5rem;

        .submit-btn {
          height: 48px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 1.5rem;
          font-weight: 600;
        }
      }
    }

    .success-banner {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background-color: var(--jp-success-bg);
      border-radius: var(--jp-radius-md);
      margin-bottom: 1.5rem;
      flex-wrap: wrap;

      .success-icon {
        color: var(--jp-success);
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      .success-text {
        flex: 1;

        h3 {
          margin: 0 0 0.35rem 0;
          color: var(--jp-text-primary);
          font-weight: 700;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--jp-text-secondary);
        }

        .sub-msg {
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          color: var(--jp-text-muted);
        }
      }
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background-color: var(--jp-danger-bg);
      color: var(--jp-danger);
      border-radius: var(--jp-radius-sm);
      font-size: 0.84375rem;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
  `]
})
export class JobSeekersComponent implements OnInit {
  private readonly seekerService = inject(JobSeekerService);
  private readonly techService = inject(TechnologyService);
  private readonly locService = inject(LocationService);
  private readonly expService = inject(ExperienceRangeService);
  private readonly fb = inject(FormBuilder);

  readonly experienceTiers = signal<ExperienceRangeOption[]>([]);
  readonly technologies = signal<TechnologyDto[]>([]);
  readonly locations = signal<LocationDto[]>([]);
  readonly activeCountData = signal<ActiveJobSeekerCountResponse | null>(null);

  readonly isSubmitting = signal<boolean>(false);
  readonly registrationSuccess = signal<boolean>(false);
  readonly registrationResult = signal<JobSeekerRegistrationResponse | null>(null);
  readonly submitError = signal<string | null>(null);

  readonly isUpdatingStatus = signal<boolean>(false);
  readonly statusUpdateSuccess = signal<boolean>(false);
  readonly statusUpdateResult = signal<JobSeekerStatusUpdateResponse | null>(null);
  readonly statusError = signal<string | null>(null);

  readonly registerForm: FormGroup = this.fb.group({
    locationId: ['', Validators.required],
    experienceRangeId: ['', Validators.required],
    technologyIds: [[], [Validators.required]],
    jobSearchStatus: ['OpenToWork', Validators.required],
    jobSearchStartDate: [''],
    salaryMin: [null],
    salaryMax: [null],
    consent: [false, Validators.requiredTrue]
  });

  readonly statusForm: FormGroup = this.fb.group({
    jobSeekerId: ['', [Validators.required]],
    status: ['OpenToWork', Validators.required]
  });

  ngOnInit(): void {
    this.loadMetadata();
    this.loadActiveCount();
  }

  loadMetadata(): void {
    this.expService.getExperienceRanges().subscribe({
      next: (tiers) => this.experienceTiers.set(tiers),
      error: () => {}
    });

    this.techService.getTechnologies().subscribe({
      next: (techs) => this.technologies.set(techs),
      error: () => {}
    });

    this.locService.getLocations().subscribe({
      next: (locs) => this.locations.set(locs),
      error: () => {}
    });
  }

  loadActiveCount(): void {
    this.seekerService.getActiveCount().subscribe({
      next: (res) => this.activeCountData.set(res),
      error: () => {}
    });
  }

  submitRegistration(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const val = this.registerForm.value;
    const request: RegisterJobSeekerRequest = {
      locationId: val.locationId,
      experienceRangeId: val.experienceRangeId,
      technologyIds: val.technologyIds,
      jobSearchStatus: val.jobSearchStatus,
      jobSearchStartDate: val.jobSearchStartDate || null,
      salaryMin: val.salaryMin ? Number(val.salaryMin) : null,
      salaryMax: val.salaryMax ? Number(val.salaryMax) : null,
      consent: !!val.consent
    };

    this.seekerService.register(request).subscribe({
      next: (res) => {
        this.registrationResult.set(res);
        this.registrationSuccess.set(true);
        this.isSubmitting.set(false);
        this.loadActiveCount();
      },
      error: (err: AppError | Error) => {
        let msg = 'Registration failed. Please check your selections.';
        if ('detail' in err && err.detail) {
          msg = err.detail;
        } else if ('message' in err && err.message) {
          msg = err.message;
        }
        this.submitError.set(msg);
        this.isSubmitting.set(false);
      }
    });
  }

  resetRegistrationForm(): void {
    this.registerForm.reset({
      locationId: '',
      experienceRangeId: '',
      technologyIds: [],
      jobSearchStatus: 'OpenToWork',
      jobSearchStartDate: '',
      salaryMin: null,
      salaryMax: null,
      consent: false
    });
    this.registrationSuccess.set(false);
    this.registrationResult.set(null);
    this.submitError.set(null);
  }

  submitStatusUpdate(): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.isUpdatingStatus.set(true);
    this.statusError.set(null);

    const request: UpdateJobSeekerStatusRequest = {
      jobSeekerId: this.statusForm.value.jobSeekerId.trim(),
      status: this.statusForm.value.status
    };

    this.seekerService.updateStatus(request).subscribe({
      next: (res) => {
        this.statusUpdateResult.set(res);
        this.statusUpdateSuccess.set(true);
        this.isUpdatingStatus.set(false);
        this.loadActiveCount();
      },
      error: (err: AppError | Error) => {
        let msg = 'Status update failed.';
        if ('detail' in err && err.detail) {
          msg = err.detail;
        } else if ('message' in err && err.message) {
          msg = err.message;
        }
        this.statusError.set(msg);
        this.isUpdatingStatus.set(false);
      }
    });
  }
}
