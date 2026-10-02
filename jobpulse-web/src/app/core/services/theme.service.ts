import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'jobpulse_theme';
  readonly isDark = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved === 'dark' || (!saved && window.matchMedia?.('(prefers-color-scheme: dark)').matches)) {
      this.setDark(true);
    } else {
      this.setDark(false);
    }
  }

  toggleTheme(): void {
    this.setDark(!this.isDark());
  }

  setDark(dark: boolean): void {
    this.isDark.set(dark);
    if (typeof document !== 'undefined') {
      if (dark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem(this.THEME_KEY, 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem(this.THEME_KEY, 'light');
      }
    }
  }
}
