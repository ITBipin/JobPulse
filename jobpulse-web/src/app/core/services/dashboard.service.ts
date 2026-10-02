import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardOverviewResponse,
  DashboardTrendsQuery,
  DashboardTrendsResponse,
  JobMarketPressureRatioQuery,
  JobMarketPressureRatioResponse
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  getOverview(): Observable<DashboardOverviewResponse> {
    return this.http.get<DashboardOverviewResponse>(`${this.baseUrl}/overview`);
  }

  getTrends(query?: DashboardTrendsQuery): Observable<DashboardTrendsResponse> {
    let params = new HttpParams();
    if (query?.from) {
      params = params.set('from', query.from);
    }
    if (query?.to) {
      params = params.set('to', query.to);
    }
    return this.http.get<DashboardTrendsResponse>(`${this.baseUrl}/trends`, { params });
  }

  getPressureRatio(query?: JobMarketPressureRatioQuery): Observable<JobMarketPressureRatioResponse> {
    let params = new HttpParams();
    if (query?.technologyId) {
      params = params.set('technologyId', query.technologyId);
    }
    if (query?.locationId) {
      params = params.set('locationId', query.locationId);
    }
    if (query?.experienceRangeId) {
      params = params.set('experienceRangeId', query.experienceRangeId);
    }
    return this.http.get<JobMarketPressureRatioResponse>(`${this.baseUrl}/pressure-ratio`, { params });
  }
}
