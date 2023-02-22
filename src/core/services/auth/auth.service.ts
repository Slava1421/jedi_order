import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IAuthResponse } from './auth.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  logIn(email: string, password: string): Observable<IAuthResponse> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>(environment.auth.login, body)
      .pipe(
        tap((resp: IAuthResponse) => {
          localStorage.setItem('authToken', resp.accessToken);
        })
      );
  }

  logOut(): Observable<IAuthResponse> {
    return this.httpClient.post<IAuthResponse>(environment.auth.logout, null).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
      })
    );
  }

  refreshToken(): Observable<IAuthResponse> {
    return this.httpClient.get<IAuthResponse>(environment.auth.refresh, { withCredentials: true }).pipe(
      tap((resp: IAuthResponse) => {
        localStorage.setItem('authToken', resp.accessToken);
      })
    );
  }

  registration(email: string, password: string): Observable<IAuthResponse> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>(environment.auth.registration, body);
  }
}
