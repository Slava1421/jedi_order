import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, Optional, ViewEncapsulation } from '@angular/core';
import { SIDEBAR_CONTROLLER } from '../../../../../core/components/sidebar/models/cz-sidebar';
import { CzSidebarControllerService } from '../../../../../core/components/sidebar/services/cz-sidebar-controller.service';
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
    @Optional() @Inject(SIDEBAR_CONTROLLER) sidebarController: CzSidebarControllerService
  ) {
    super(el, ngZone, sidebarController);
  }

}
