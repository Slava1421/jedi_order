import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SIDEBAR_TOKEN, SIDEBAR_CONTROLLER, SidebarThemes } from '../../models/cz-sidebar';
import { CzSidebarControllerService } from '../../services/cz-sidebar-controller.service';
import { globalTheme } from 'src/core/helpers/tools';

@Component({
  selector: 'cz-sidebar',
  templateUrl: './cz-sidebar.component.html',
  styleUrls: ['./cz-sidebar.component.scss'],
  host: {
    'class': 'sidebar ',
    // '[class.dark]': 'isDark',
  },
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: SIDEBAR_TOKEN, useClass: CzSidebarComponent
  }]
})
export class CzSidebarComponent implements OnDestroy {
  private unsuscriber$ = new Subject();
  private _themeState: 'dark' | 'light' = 'light';
  collapsed = false;


  public get isDark(): boolean {
    return this._themeState === 'dark';
  }

  setGlobalTheme = globalTheme();

  constructor(
    @Inject(SIDEBAR_CONTROLLER) private _sidebarController: CzSidebarControllerService
  ) {
    _sidebarController.collapsed$
      .pipe(takeUntil(this.unsuscriber$))
      .subscribe({
        next: (val: boolean) => {
          this.collapsed = val;
        }
      });
  }

  onSwitchTheme(): void {


    this._themeState = this._themeState === 'dark' ? 'light' : 'dark';
    this.setGlobalTheme(this._themeState);
    this._sidebarController.themeToggle(this._themeState as SidebarThemes);
  }

  ngOnDestroy(): void {
    this.unsuscriber$.next(null);
    this.unsuscriber$.complete();
  }
}
