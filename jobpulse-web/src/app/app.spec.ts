import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideAnimationsAsync()
      ]
    }).compileComponents();
  });

  it('should create the app shell', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.title).toBe('JobPulse');
  });

  it('should toggle sidebar when toggleSidebar is called', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.isSidebarOpen()).toBe(false);

    app.toggleSidebar();
    expect(app.isSidebarOpen()).toBe(true);

    app.closeSidebar();
    expect(app.isSidebarOpen()).toBe(false);
  });
});
