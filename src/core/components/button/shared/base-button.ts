import { Directive, ElementRef, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { SidebarThemes } from "../../sidebar/models/cz-sidebar";
import { CzSidebarControllerService } from "../../sidebar/services/cz-sidebar-controller.service";
import { _MatButtonMixin as ButtonMixin } from "./disabled-button";

/** Shared host configuration for all buttons */
export const CZ_BUTTON_INPUTS = ['disabled', 'color'];

export const CZ_BUTTON_HOST = {
  '[attr.disabled]': 'disabled || null',
  'class': 'cz-button',
  '[class.unthemed]': '!color && !themeState',
  '[class.dark]': 'themeState === "dark" && !color',
  '[class.dark-theme]': 'themeState === "dark" && !color',
  '[class.light-theme]': 'themeState === "light" && !color'
};

@Directive()
export class CzButtonBase extends ButtonMixin implements OnInit, OnDestroy {

  private _unsubscribe$ = new Subject();
  themeState: SidebarThemes | undefined = undefined;

  constructor(
    _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _sidebarController: CzSidebarControllerService
  ) {
    super(_elementRef);

    if (_sidebarController) {
      _sidebarController.themeState$
        .pipe(
          takeUntil(this._unsubscribe$)
        )
        .subscribe({
          next: (v) => {
            this.themeState = v;
          }
        });
    }
  }

  ngOnInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this._elementRef.nativeElement.addEventListener('click', this._haltDisabledEvents);
    });
  }

  ngOnDestroy(): void {
    this._elementRef.nativeElement.removeEventListener('click', this._haltDisabledEvents);
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }

  _haltDisabledEvents = (event: Event): void => {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
}