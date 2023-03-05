import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IAuthResponse, IUser } from './auth.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: IUser | null;

  public isLogin = new BehaviorSubject<boolean | null>(null);
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
        })
      );
  }

  logOut(): Observable<IAuthResponse> {
    return this.httpClient.post<IAuthResponse>(environment.auth.logout, null).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        this._setUser(null, false);
      })
    );
  }

  refreshToken(): Observable<IAuthResponse> {
    return this.httpClient.get<IAuthResponse>(environment.auth.refresh, { withCredentials: true }).pipe(
      tap((resp: IAuthResponse) => {
        localStorage.setItem('authToken', resp.accessToken);
        this._setUser(resp.user, true);
      })
    );
  }

  registration(email: string, password: string): Observable<IAuthResponse> {
    const body = { email, password };
    return this.httpClient.post<IAuthResponse>(environment.auth.registration, body);
  }

  private _setUser(user: IUser | null, isLogin: boolean): void {
    this._user = user;
    this.isLogin.next(isLogin);
  }
}
