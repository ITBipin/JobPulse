import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BrandLogoComponent } from '../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule, BrandLogoComponent],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <app-brand-logo [linkable]="true" linkUrl="/dashboard" size="lg" subtitle="India Market Intelligence"></app-brand-logo>
            <p class="brand-desc">
              Transparent, data-backed intelligence for the Indian job ecosystem. Tracking active openings, technology demand, and market pressure ratios.
            </p>
          </div>

          <div class="footer-links">
            <div class="link-group">
              <div class="group-title">Navigation</div>
              <a routerLink="/dashboard">Dashboard Overview</a>
              <a routerLink="/jobs">Explore Openings</a>
              <a routerLink="/job-seekers">Seeker Portal</a>
              <a routerLink="/methodology">Methodology &amp; Transparency</a>
            </div>

            <div class="link-group">
              <div class="group-title">Transparency</div>
              <a routerLink="/methodology">Data Freshness Policy</a>
              <a routerLink="/methodology">Market Pressure Ratio</a>
              <a routerLink="/methodology">Voluntary Registration Scope</a>
            </div>
          </div>
        </div>

        <div class="footer-disclaimer">
          <mat-icon class="disclaimer-icon">info</mat-icon>
          <p>
            <strong>Disclaimer:</strong> JobPulse metrics reflect platform-tracked active job openings and voluntarily registered job seekers. JobPulse does not claim or purport to represent all job seekers or employment statistics across India. All data freshness adheres to automated verification standards.
          </p>
        </div>

        <div class="footer-bottom">
          <span>&copy; {{ currentYear }} JobPulse – India Job Market Intelligence. All rights reserved.</span>
          <span class="version-tag">Production Ready v1.0</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: var(--jp-bg-surface);
      border-top: 1px solid var(--jp-border-color);
      padding: 3rem 1.25rem 1.5rem;
      margin-top: auto;
      color: var(--jp-text-secondary);
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .footer-top {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 2.5rem;
    }

    .footer-brand {
      max-width: 420px;

      .brand-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--jp-text-primary);
        margin-bottom: 0.75rem;

        .brand-icon {
          color: var(--jp-brand-primary);
        }
      }

      .brand-desc {
        font-size: 0.875rem;
        line-height: 1.6;
        color: var(--jp-text-muted);
        margin: 0;
      }
    }

    .footer-links {
      display: flex;
      gap: 3rem;
      flex-wrap: wrap;

      .link-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .group-title {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--jp-text-primary);
          margin-bottom: 0.25rem;
        }

        a {
          font-size: 0.875rem;
          color: var(--jp-text-muted);
          text-decoration: none;
          transition: color 0.15s ease;

          &:hover {
            color: var(--jp-brand-primary);
          }
        }
      }
    }

    .footer-disclaimer {
      display: flex;
      gap: 0.875rem;
      padding: 1rem 1.25rem;
      background-color: var(--jp-bg-subtle);
      border-radius: var(--jp-radius-md);
      border: 1px solid var(--jp-border-subtle);

      .disclaimer-icon {
        color: var(--jp-warning);
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      p {
        margin: 0;
        font-size: 0.8125rem;
        line-height: 1.5;
        color: var(--jp-text-muted);

        strong {
          color: var(--jp-text-primary);
        }
      }
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--jp-border-subtle);
      font-size: 0.8125rem;
      color: var(--jp-text-muted);

      .version-tag {
        font-size: 0.75rem;
        font-family: monospace;
        padding: 0.2rem 0.5rem;
        background-color: var(--jp-bg-subtle);
        border-radius: var(--jp-radius-sm);
      }
    }
  `]
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
