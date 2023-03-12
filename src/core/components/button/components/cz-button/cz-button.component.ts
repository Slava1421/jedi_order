import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, Optional, ViewEncapsulation } from '@angular/core';
import { CzSidebarComponent } from 'src/core/components/sidebar/components/cz-sidebar/cz-sidebar.component';
import { SIDEBAR_CONTROLLER, SIDEBAR_TOKEN } from 'src/core/components/sidebar/models/cz-sidebar';
import { CzSidebarControllerService } from 'src/core/components/sidebar/services/cz-sidebar-controller.service';
import { CzButtonBase, CZ_BUTTON_HOST, CZ_BUTTON_INPUTS } from '../../shared/base-button';

@Component({
  selector: 'button[cz-button]',
  templateUrl: './cz-button.component.html',
  styleUrls: ['./cz-button.component.scss'],
  inputs: CZ_BUTTON_INPUTS,
  host: CZ_BUTTON_HOST,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CzButtonComponent extends CzButtonBase {

  constructor(
    el: ElementRef,
    ngZone: NgZone,
    @Optional() @Inject(SIDEBAR_TOKEN) private sidebar: CzSidebarComponent,
    @Optional() @Inject(SIDEBAR_CONTROLLER) private sidebarController: CzSidebarControllerService
  ) {
    super(el, ngZone, sidebar, sidebarController);
  }

}
