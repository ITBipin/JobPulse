import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (linkable()) {
      <a [routerLink]="linkUrl()" class="brand-logo-link" [class]="'size-' + size()" aria-label="JobPulse Home">
        <ng-container *ngTemplateOutlet="logoContent"></ng-container>
      </a>
    } @else {
      <div class="brand-logo-container" [class]="'size-' + size()">
        <ng-container *ngTemplateOutlet="logoContent"></ng-container>
      </div>
    }

    <ng-template #logoContent>
      <div class="logo-emblem" [class]="'emblem-' + size()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" class="emblem-svg">
          <defs>
            <linearGradient [id]="'badgeGrad-' + uid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#0369a1" />
              <stop offset="100%" stop-color="#0c4a6e" />
            </linearGradient>
            <linearGradient [id]="'pulseGrad-' + uid" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="35%" stop-color="#f59e0b" />
              <stop offset="55%" stop-color="#fbbf24" />
              <stop offset="75%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#ffffff" />
            </linearGradient>
            <linearGradient [id]="'barGrad-' + uid" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.65" />
            </linearGradient>
          </defs>

          <!-- Emblem Container Badge -->
          <rect x="5" y="5" width="90" height="90" rx="22" [attr.fill]="'url(#badgeGrad-' + uid + ')'" />

          <!-- Background Analytics Bars -->
          <rect x="42" y="48" width="7" height="24" rx="2" [attr.fill]="'url(#barGrad-' + uid + ')'" />
          <rect x="53" y="38" width="7" height="34" rx="2" [attr.fill]="'url(#barGrad-' + uid + ')'" />
          <rect x="64" y="28" width="7" height="44" rx="2" [attr.fill]="'url(#barGrad-' + uid + ')'" />

          <!-- The JobPulse ECG Waveform Line -->
          <path d="M 12 52 L 26 52 L 34 38 L 42 66 L 49 24 L 56 68 L 63 44 L 78 28"
                fill="none"
                [attr.stroke]="'url(#pulseGrad-' + uid + ')'"
                stroke-width="4.5"
                stroke-linecap="round"
                stroke-linejoin="round" />

          <!-- Upward Arrowhead -->
          <polygon points="78,20 89,31 78,34 82,27"
                   fill="#ffffff" />

          <!-- Center Pulse Spark Dot -->
          <circle cx="49" cy="24" r="3.2" fill="#f59e0b" />
          <circle cx="49" cy="24" r="1.6" fill="#ffffff" />
        </svg>
      </div>

      @if (showText()) {
        <div class="brand-text">
          <div class="brand-name">
            <span class="name-job">Job</span><span class="name-pulse">Pulse</span>
          </div>
          @if (subtitle()) {
            <span class="brand-subtitle">{{ subtitle() }}</span>
          }
        </div>
      }
    </ng-template>
  `,
  styles: [`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    .brand-logo-link,
    .brand-logo-container {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      text-decoration: none;
      color: inherit;
      user-select: none;
      transition: transform 0.15s ease, opacity 0.15s ease;

      &:hover {
        opacity: 0.95;
      }
    }

    .logo-emblem {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: var(--jp-radius-md, 8px);
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
      overflow: hidden;

      .emblem-svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      &.emblem-sm {
        width: 28px;
        height: 28px;
        border-radius: 6px;
      }

      &.emblem-md {
        width: 38px;
        height: 38px;
        border-radius: 9px;
      }

      &.emblem-lg {
        width: 50px;
        height: 50px;
        border-radius: 12px;
      }

      &.emblem-xl {
        width: 68px;
        height: 68px;
        border-radius: 16px;
      }
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;

      .brand-name {
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--jp-text-primary, #0f172a);

        .name-job {
          color: var(--jp-text-primary, #0f172a);
        }

        .name-pulse {
          color: var(--jp-brand-primary, #0284c7);
        }
      }

      .brand-subtitle {
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--jp-brand-primary, #0284c7);
      }
    }

    /* Size variants */
    .size-sm {
      gap: 0.5rem;
      .brand-name { font-size: 0.95rem; }
      .brand-subtitle { font-size: 0.625rem; }
    }

    .size-md {
      gap: 0.625rem;
      .brand-name { font-size: 1.15rem; }
      .brand-subtitle { font-size: 0.7rem; }
    }

    .size-lg {
      gap: 0.75rem;
      .brand-name { font-size: 1.45rem; }
      .brand-subtitle { font-size: 0.78125rem; }
    }

    .size-xl {
      gap: 1rem;
      .brand-name { font-size: 2rem; }
      .brand-subtitle { font-size: 0.875rem; }
    }
  `]
})
export class BrandLogoComponent {
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly showText = input<boolean>(true);
  readonly subtitle = input<string>('India Intelligence');
  readonly linkable = input<boolean>(false);
  readonly linkUrl = input<string>('/dashboard');

  readonly uid = Math.random().toString(36).substring(2, 8);
}
