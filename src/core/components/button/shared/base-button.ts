import { Directive, ElementRef, NgZone, OnDestroy, OnInit } from "@angular/core";
import { _MatButtonMixin as ButtonMixin } from "./disabled-button";

/** Shared host configuration for all buttons */
export const CZ_BUTTON_INPUTS = ['disabled', 'color'];

export const CZ_BUTTON_HOST = {
  '[attr.disabled]': 'disabled || null',
  '[class.cz-button]': 'true',
  '[class.unthemed]': '!color',
};

@Directive()
export class CzButtonBase extends ButtonMixin implements OnInit, OnDestroy {
  constructor(
    _elementRef: ElementRef,
    private _ngZone: NgZone,
  ) {
    super(_elementRef);
  }

  ngOnInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this._elementRef.nativeElement.addEventListener('click', this._haltDisabledEvents);
    });
  }

  ngOnDestroy(): void {
    this._elementRef.nativeElement.removeEventListener('click', this._haltDisabledEvents);
  }

  _haltDisabledEvents = (event: Event): void => {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
}