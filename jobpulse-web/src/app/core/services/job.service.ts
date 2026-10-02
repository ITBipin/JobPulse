import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  JobFreshnessDto,
  JobListingDto,
  JobListingImportSummary,
  JobListQuery,
  JobListResponse
} from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/jobs`;

  getJobs(query?: JobListQuery): Observable<JobListResponse> {
    let params = new HttpParams();
    if (query?.search) {
      params = params.set('search', query.search);
    }
    if (query?.technology) {
      params = params.set('technology', query.technology);
    }
    if (query?.location) {
      params = params.set('location', query.location);
    }
    if (query?.experience) {
      params = params.set('experience', query.experience);
    }
    if (query?.fromDate) {
      params = params.set('fromDate', query.fromDate);
    }
    if (query?.toDate) {
      params = params.set('toDate', query.toDate);
    }
    if (query?.pageNumber !== undefined) {
      params = params.set('pageNumber', query.pageNumber.toString());
    }
    if (query?.pageSize !== undefined) {
      params = params.set('pageSize', query.pageSize.toString());
    }

    return this.http.get<JobListResponse>(this.baseUrl, { params });
  }

  getJobById(id: string): Observable<JobListingDto> {
    return this.http.get<JobListingDto>(`${this.baseUrl}/${id}`);
  }

  getFreshness(id: string): Observable<JobFreshnessDto> {
    return this.http.get<JobFreshnessDto>(`${this.baseUrl}/${id}/freshness`);
  }

  importCsv(file: File): Observable<JobListingImportSummary> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<JobListingImportSummary>(`${this.baseUrl}/import`, formData);
  }
}
