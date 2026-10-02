import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TechnologyDto } from '../models/technology.model';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/technologies`;

  getTechnologies(search?: string): Observable<TechnologyDto[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<TechnologyDto[]>(this.baseUrl, { params });
  }
}
