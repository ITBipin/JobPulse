import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <section class="page-header" aria-labelledby="page-title">
      @if (breadcrumbs().length > 0) {
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            @for (item of breadcrumbs(); track item.label; let last = $last) {
              <li>
                @if (item.url && !last) {
                  <a [routerLink]="item.url">{{ item.label }}</a>
                  <mat-icon class="separator">chevron_right</mat-icon>
                } @else {
                  <span aria-current="page" class="current">{{ item.label }}</span>
                }
              </li>
            }
          </ol>
        </nav>
      }

      <div class="header-main">
        <div class="title-section">
          <div class="title-row">
            <h1 id="page-title" class="title">{{ title() }}</h1>
            @if (badge()) {
              <span class="badge" [class]="badgeClass()">{{ badge() }}</span>
            }
          </div>
          @if (subtitle()) {
            <p class="subtitle">{{ subtitle() }}</p>
          }
        </div>

        <div class="actions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-header {
      margin-bottom: 1.75rem;
    }

    .breadcrumbs {
      margin-bottom: 0.5rem;

      ol {
        display: flex;
        align-items: center;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        font-size: 0.8125rem;
      }

      li {
        display: flex;
        align-items: center;

        a {
          color: var(--jp-text-muted);
          text-decoration: none;
          &:hover {
            color: var(--jp-brand-primary);
            text-decoration: underline;
          }
        }

        .current {
          color: var(--jp-text-secondary);
          font-weight: 500;
        }

        .separator {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: var(--jp-text-disabled);
        }
      }
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .title-section {
      flex: 1;
      min-width: 260px;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;

      .title {
        font-size: 1.75rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: var(--jp-text-primary);
        margin: 0;
        line-height: 1.2;
      }
    }

    .subtitle {
      font-size: 0.9375rem;
      color: var(--jp-text-muted);
      margin: 0.375rem 0 0 0;
      line-height: 1.5;
      max-width: 800px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  `]
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly badge = input<string>();
  readonly badgeClass = input<string>('badge-info');
  readonly breadcrumbs = input<BreadcrumbItem[]>([]);
}
