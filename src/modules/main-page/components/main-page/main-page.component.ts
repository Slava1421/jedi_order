import { Component, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SIDEBAR_CONTROLLER } from '../../../../core/components/sidebar/models/cz-sidebar';
import { CzSidebarControllerService } from '../../../../core/components/sidebar/services/cz-sidebar-controller.service';
import { generateAvatar } from '../../../../core/helpers/tools';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnDestroy {

  private unsubscriber$ = new Subject();
  avatar: string;
  userName: string;
  collapsed: boolean;
  constructor(
    private _auth: AuthService,
    private _router: Router,
    @Inject(SIDEBAR_CONTROLLER) private _sidebarController: CzSidebarControllerService
  ) {
    this._checkIsLogin();
    this._checkSidebarCollapse();
  }

  logout(): void {
    this._auth.logOut().subscribe(
      {
        next: () => {
          this._router.navigate(['/auth']);
        },
        error: (e) => {
          console.error(e);
          alert('Помилка');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next(null);
    this.unsubscriber$.complete();
  }

  private _checkSidebarCollapse(): void {
    this._sidebarController.collapsed$
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe({
        next: (val: boolean) => {
          this.collapsed = val;
        }
      });
  }

  private _checkIsLogin(): void {
    this._auth.isLogin
      .pipe(
        takeUntil(this.unsubscriber$),
        filter(f => f !== null)
      )
      .subscribe({
        next: (status: boolean | null) => {
          if (status) {
            this.avatar = generateAvatar(this._auth.user!.email);
            this.userName = this._auth.user?.email as string;
          } else {
            this.avatar = '';
            this.userName = '';
          }

        }
      });
  }
}
