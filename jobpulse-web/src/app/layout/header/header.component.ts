import { Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../core/services/theme.service';

import { BrandLogoComponent } from '../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    BrandLogoComponent
  ],
  template: `
    <header class="app-header">
      <div class="header-container">
        <div class="header-left">
          <button
            mat-icon-button
            class="menu-toggle-btn"
            (click)="toggleMenu.emit()"
            aria-label="Toggle navigation menu"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <app-brand-logo [linkable]="true" linkUrl="/dashboard" size="md"></app-brand-logo>
        </div>

        <nav class="header-nav desktop-only" aria-label="Main Navigation">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <mat-icon class="nav-icon">dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/jobs" routerLinkActive="active" class="nav-link">
            <mat-icon class="nav-icon">work_outline</mat-icon>
            <span>Explore Jobs</span>
          </a>
          <a routerLink="/job-seekers" routerLinkActive="active" class="nav-link">
            <mat-icon class="nav-icon">person_add_alt</mat-icon>
            <span>Seeker Registration</span>
          </a>
          <a routerLink="/methodology" routerLinkActive="active" class="nav-link">
            <mat-icon class="nav-icon">info_outline</mat-icon>
            <span>Methodology</span>
          </a>
        </nav>

        <div class="header-right">
          <button
            mat-icon-button
            class="theme-toggle-btn"
            (click)="themeService.toggleTheme()"
            [matTooltip]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            [attr.aria-label]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: var(--jp-header-height);
      background-color: var(--jp-bg-surface);
      border-bottom: 1px solid var(--jp-border-color);
      box-shadow: var(--jp-shadow-sm);
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 1.25rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .menu-toggle-btn {
      display: none;
      color: var(--jp-text-secondary);
      @media (max-width: 900px) {
        display: inline-flex;
      }
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      text-decoration: none;
      color: inherit;

      .logo-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: var(--jp-radius-md);
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        color: #ffffff;

        mat-icon {
          font-size: 22px;
          width: 22px;
          height: 22px;
        }
      }

      .brand-text {
        display: flex;
        flex-direction: column;

        .brand-name {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--jp-text-primary);
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--jp-brand-primary);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
      }
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .nav-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 0.875rem;
        border-radius: var(--jp-radius-sm);
        color: var(--jp-text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        transition: background-color 0.15s ease, color 0.15s ease;

        .nav-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        &:hover {
          background-color: var(--jp-bg-surface-hover);
          color: var(--jp-text-primary);
        }

        &.active {
          background-color: var(--jp-brand-subtle);
          color: var(--jp-brand-text);
          font-weight: 600;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .theme-toggle-btn {
        color: var(--jp-text-secondary);
        &:hover {
          color: var(--jp-text-primary);
        }
      }
    }

    @media (max-width: 900px) {
      .desktop-only {
        display: none !important;
      }
    }
  `]
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly toggleMenu = output<void>();
}
