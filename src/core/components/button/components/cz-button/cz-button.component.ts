import { ChangeDetectionStrategy, Component, ElementRef, NgZone, ViewEncapsulation } from '@angular/core';
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
  ) {
    super(el, ngZone);
  }

}
