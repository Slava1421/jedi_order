import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { SIDEBAR_CONTROLLER } from '../../models/cz-sidebar';
import { CzSidebarControllerService } from '../../services/cz-sidebar-controller.service';

@Component({
  selector: 'nav-head',
  templateUrl: './nav-head.component.html',
  styleUrls: ['./nav-head.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'sidebar__head h6'
  },
})
export class NavHeadComponent {
  collapsed: boolean

  constructor(@Inject(SIDEBAR_CONTROLLER) private sidebarController: CzSidebarControllerService) {
    this.collapsed = sidebarController.collapsed$.value;
  }

  collapse(): void {
    this.collapsed = this.sidebarController.collapsedToggle();
  }
}
