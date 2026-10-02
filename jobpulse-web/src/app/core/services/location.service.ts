import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocationDto } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/locations`;

  getLocations(city?: string): Observable<LocationDto[]> {
    let params = new HttpParams();
    if (city) {
      params = params.set('city', city);
    }
    return this.http.get<LocationDto[]>(this.baseUrl, { params });
  }
}
