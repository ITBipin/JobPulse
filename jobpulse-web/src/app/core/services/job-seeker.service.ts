import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ActiveJobSeekerCountResponse,
  JobSeekerRegistrationResponse,
  JobSeekerStatusUpdateResponse,
  RegisterJobSeekerRequest,
  UpdateJobSeekerStatusRequest
} from '../models/job-seeker.model';

@Injectable({
  providedIn: 'root'
})
export class JobSeekerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/job-seekers`;

  getActiveCount(): Observable<ActiveJobSeekerCountResponse> {
    return this.http.get<ActiveJobSeekerCountResponse>(`${this.baseUrl}/active-count`);
  }

  register(request: RegisterJobSeekerRequest): Observable<JobSeekerRegistrationResponse> {
    return this.http.post<JobSeekerRegistrationResponse>(`${this.baseUrl}/register`, request);
  }

  updateStatus(request: UpdateJobSeekerStatusRequest): Observable<JobSeekerStatusUpdateResponse> {
    return this.http.put<JobSeekerStatusUpdateResponse>(`${this.baseUrl}/status`, request);
  }
}
