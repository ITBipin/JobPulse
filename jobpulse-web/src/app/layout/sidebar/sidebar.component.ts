import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  template: `
    <aside class="sidebar-container" aria-label="Mobile Navigation">
      <div class="sidebar-header">
        <div class="sidebar-title">Navigation</div>
        <button mat-icon-button (click)="close.emit()" aria-label="Close navigation">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <mat-nav-list class="nav-list">
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active" (click)="close.emit()">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
          <span matListItemLine class="item-sub">Market Overview &amp; Trends</span>
        </a>

        <a mat-list-item routerLink="/jobs" routerLinkActive="active" (click)="close.emit()">
          <mat-icon matListItemIcon>work_outline</mat-icon>
          <span matListItemTitle>Explore Jobs</span>
          <span matListItemLine class="item-sub">Tracked Openings &amp; Freshness</span>
        </a>

        <a mat-list-item routerLink="/job-seekers" routerLinkActive="active" (click)="close.emit()">
          <mat-icon matListItemIcon>person_add_alt</mat-icon>
          <span matListItemTitle>Job Seeker Registration</span>
          <span matListItemLine class="item-sub">Voluntary Candidate Portal</span>
        </a>

        <a mat-list-item routerLink="/methodology" routerLinkActive="active" (click)="close.emit()">
          <mat-icon matListItemIcon>info_outline</mat-icon>
          <span matListItemTitle>Methodology &amp; Transparency</span>
          <span matListItemLine class="item-sub">Data Sources &amp; Disclaimers</span>
        </a>
      </mat-nav-list>

      <div class="sidebar-footer">
        <div class="disclaimer-badge">
          <mat-icon>shield</mat-icon>
          <span>India Market Intelligence</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: var(--jp-bg-surface);
      color: var(--jp-text-primary);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      font-weight: 600;
      font-size: 1rem;
    }

    .nav-list {
      flex: 1;
      padding-top: 0.5rem;

      a.active {
        background-color: var(--jp-brand-subtle);
        color: var(--jp-brand-text);

        mat-icon {
          color: var(--jp-brand-text);
        }
      }

      .item-sub {
        font-size: 0.75rem;
        color: var(--jp-text-muted);
      }
    }

    .sidebar-footer {
      padding: 1.25rem;
      border-top: 1px solid var(--jp-border-color);

      .disclaimer-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: var(--jp-text-muted);

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: var(--jp-brand-primary);
        }
      }
    }
  `]
})
export class SidebarComponent {
  readonly close = output<void>();
}
