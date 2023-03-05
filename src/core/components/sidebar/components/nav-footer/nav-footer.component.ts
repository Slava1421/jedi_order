import { Component, Inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SIDEBAR_CONTROLLER } from '../../models/cz-sidebar';
import { CzSidebarControllerService } from '../../services/cz-sidebar-controller.service';

@Component({
  selector: 'nav-footer',
  templateUrl: './nav-footer.component.html',
  styleUrls: ['./nav-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'nav-footer'
  }
})
export class NavFooterComponent implements OnDestroy {
  private unsuscriber$ = new Subject();
  @Input() avatar: string;

  collapsed = false;

  constructor(@Inject(SIDEBAR_CONTROLLER) private sidebarController: CzSidebarControllerService) {
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
