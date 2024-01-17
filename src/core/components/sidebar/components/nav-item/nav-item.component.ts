import { Component, Inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SIDEBAR_CONTROLLER } from '../../models/cz-sidebar';
import { CzSidebarControllerService } from '../../services/cz-sidebar-controller.service';

@Component({
  selector: 'nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'sidebar__item',
    '[class.sidebar__item_active]': 'activeItem'
  }
})
export class NavItemComponent implements OnDestroy {
  private unsuscriber$ = new Subject();
  private _active: boolean | string;
  collapsed = false;
  @Input() icon: string;
  @Input() public set activeItem(val: boolean | string) {
    this._active = val === 'true' || val === true;
  }

  public get activeItem(): boolean | string {
    return this._active;
  }

  constructor(@Inject(SIDEBAR_CONTROLLER) sidebarController: CzSidebarControllerService) {
    sidebarController.collapsed$
      .pipe(
        takeUntil(this.unsuscriber$)
      )
      .subscribe({
        next: (val: boolean) => {
          this.collapsed = val;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsuscriber$.next(null);
    this.unsuscriber$.complete();
  }
}
