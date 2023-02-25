import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay, take } from 'rxjs';
import { IAuthResponse } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  init(): void {
    const splashScreen = this.document.querySelector('#splash-screen');
    this.auth.refreshToken()
      .pipe(take(1))
      .subscribe(
        {
          next: (resp: IAuthResponse) => {
            splashScreen?.remove();
            this.router.navigate(['/main']);
          },
          error: (e) => {

            if (e instanceof HttpErrorResponse) {
              if (e.status !== 401) {
                return;
              }
              console.error(e);
              splashScreen?.remove();
              this.router.navigate(['/auth']);
            }
          }
        }
      );
  }
}
