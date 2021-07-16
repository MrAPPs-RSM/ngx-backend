import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  apiLoaded: Observable<boolean>;

  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp(
      'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsApiKey,
      'callback'
    )
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
