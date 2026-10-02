import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/jobs.component').then(m => m.JobsComponent)
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./features/jobs/job-detail.component').then(m => m.JobDetailComponent)
  },
  {
    path: 'job-seekers',
    loadComponent: () => import('./features/job-seekers/job-seekers.component').then(m => m.JobSeekersComponent)
  },
  {
    path: 'methodology',
    loadComponent: () => import('./features/methodology/methodology.component').then(m => m.MethodologyComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
