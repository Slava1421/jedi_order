import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthResponse } from './auth.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  logIn(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>(environment.auth.login, body);
  }

  logOut(): Observable<any> {
    return this.httpClient.post<IAuthResponse>(environment.auth.logout, null);
  }

  // refreshToken(): Observable<any> {
  //   return undefined;
  // }

  registration(email: string, password: string): Observable<IAuthResponse> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>(environment.auth.registration, body);
  }
}
