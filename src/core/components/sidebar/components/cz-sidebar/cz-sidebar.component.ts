import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SIDEBAR_CONTROLLER } from '../../models/cz-sidebar';
import { CzSidebarControllerService } from '../../services/cz-sidebar-controller.service';

@Component({
  selector: 'cz-sidebar',
  templateUrl: './cz-sidebar.component.html',
  styleUrls: ['./cz-sidebar.component.scss'],
  host: {
    'class': 'sidebar ',
    '[class.dark]': 'isDark',
  },
  encapsulation: ViewEncapsulation.None,
  
})
export class CzSidebarComponent implements OnDestroy {
  private unsuscriber$ = new Subject();
  private _themeState: 'dark' | 'light' = 'light';
  collapsed = false;

  
  public get isDark() : boolean {
    return this._themeState === 'dark';
  }
  

  constructor(@Inject(SIDEBAR_CONTROLLER) sidebarController: CzSidebarControllerService) {
    sidebarController.collapsed$
      .pipe(takeUntil(this.unsuscriber$))
      .subscribe({
        next: (val: boolean) => {
          this.collapsed = val;
        }
      });
  }

  onSwitchTheme(): void {
    this._themeState = this._themeState === 'dark' ? 'light' : 'dark';
  }

  ngOnDestroy(): void {
    this.unsuscriber$.next(null);
    this.unsuscriber$.complete();
  }
}
