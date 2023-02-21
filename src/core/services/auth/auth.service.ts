import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthResponse } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  logIn(): Observable<any> {
    // return this.httpClient.g;
  }

  logOut(): Observable<any> {
    return undefined;
  }

  refreshToken(): Observable<any> {
    return undefined;
  }

  registration(email: string, password: string): Observable<IAuthResponse> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>('', body);
  }
}
