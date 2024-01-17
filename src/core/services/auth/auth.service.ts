import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { IAuthResponse, IUser } from './auth.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: IUser | null;

  public isLogin$ = new BehaviorSubject<boolean | null>(null);
  get user(): IUser | null {
    return this._user;
  }

  constructor(private httpClient: HttpClient) { }

  logIn(email: string, password: string): Observable<IAuthResponse> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>(environment.auth.login, body)
      .pipe(
        tap((resp: IAuthResponse) => {
          localStorage.setItem('authToken', resp.accessToken);
          this._setUser(resp.user, true);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error login:', error);
          return throwError(() => error);
        })
      );
  }

  logOut(): Observable<IAuthResponse> {
    return this.httpClient.post<IAuthResponse>(environment.auth.logout, null).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        this._setUser(null, false);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error logout:', error);
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<IAuthResponse> {
    return this.httpClient.get<IAuthResponse>(environment.auth.refresh, { withCredentials: true }).pipe(
      tap((resp: IAuthResponse) => {
        localStorage.setItem('authToken', resp.accessToken);
        this._setUser(resp.user, true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error refreshing token:', error);
        if (error.status === 401) {
          this._setUser(null, false);
        }
        return throwError(() => error);
      })
    );
  }

  registration(email: string, password: string): Observable<IAuthResponse> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>(environment.auth.registration, body);
  }

  private _setUser(user: IUser | null, isLogin: boolean): void {
    this._user = user;
    this.isLogin$.next(isLogin);
  }
}
