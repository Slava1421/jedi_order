import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { IAuthResponse } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  init(): void {
    this.auth.refreshToken()
    .pipe(take(1))
    .subscribe(
      {
        next: (resp: IAuthResponse) => {
          console.log('init', resp);
          this.router.navigate(['/main']);
        },
        error: (e) => {
          console.error(e);
          this.router.navigate(['/auth']);
        }
      }
    );
  }
}
