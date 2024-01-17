import { ComponentRef, EmbeddedViewRef, InjectionToken } from "@angular/core";
import { CzSnackBarConfig } from "./snack-bar-config";
import { Observable, Subject } from "rxjs";
import { ComponentPortal, TemplatePortal } from "./portal";
import { OverlayRef } from "./overlay-ref";

export interface _SnackBarContainer {
  snackBarConfig: CzSnackBarConfig;
  readonly onExit: Subject<any>;
  readonly onEnter: Subject<any>;
  enter: () => void;
  exit: () => Observable<void>;
  attachTemplatePortal: <C>(portal: TemplatePortal<C>) => EmbeddedViewRef<C>;
  attachComponentPortal: <T>(portal: ComponentPortal<T>) => ComponentRef<T>;
}

export interface ComponentType<T> {
  new(...args: any[]): T;
}

export const CZ_SNACK_BAR_DATA = new InjectionToken<any>('CzSnackBarData');
export const CZ_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken<CzSnackBarConfig>(
  'cz-snack-bar-default-options',
  {
    providedIn: 'root',
    factory: CZ_SNACK_BAR_DEFAULT_OPTIONS_FACTORY,
  },
);

export function CZ_SNACK_BAR_DEFAULT_OPTIONS_FACTORY(): CzSnackBarConfig {
  return new CzSnackBarConfig();
}

/** Maximum amount of milliseconds that can be passed into setTimeout. */
const MAX_TIMEOUT = Math.pow(2, 31) - 1;

export class CzSnackBarRef<T> {
  instance: T;
  containerInstance: _SnackBarContainer;
  /** Subject for notifying the user that the snack bar has been dismissed. */
  private readonly _afterDismissed = new Subject<{
    dismissedByAction: boolean;
  }>();

  /**
    * Timeout ID for the duration setTimeout call. Used to clear the timeout if the snackbar is
    * dismissed before the duration passes.
    */
  private _durationTimeoutId: any;

  /** Subject for notifying the user that the snack bar has opened and appeared. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the snack bar action was called. */
  private readonly _onAction = new Subject<void>();

  private _dismissedByAction = false;

  constructor(containerInstance: _SnackBarContainer, private _overlayRef: OverlayRef) {
    this.containerInstance = containerInstance;
    containerInstance.onExit.subscribe(() => this._finishDismiss());
  }

  /** Marks the snackbar as opened */
  _open(): void {
    if (!this._afterOpened.closed) {
      this._afterOpened.next();
      this._afterOpened.complete();
    }
  }

  /** Dismisses the snack bar. */
  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    clearTimeout(this._durationTimeoutId);
  }

  /** Marks the snackbar action clicked. */
  dismissWithAction(): void {
    if (!this._onAction.closed) {
      this._dismissedByAction = true;
      this._onAction.next();
      this._onAction.complete();
      this.dismiss();
    }
    clearTimeout(this._durationTimeoutId);
  }

  /**
   * Marks the snackbar action clicked.
   * @deprecated Use `dismissWithAction` instead.
   * @breaking-change 8.0.0
   */
  closeWithAction(): void {
    this.dismissWithAction();
  }

  /** Dismisses the snack bar after some duration */
  _dismissAfter(duration: number): void {
    // Note that we need to cap the duration to the maximum value for setTimeout, because
    // it'll revert to 1 if somebody passes in something greater (e.g. `Infinity`). See #17234.
    this._durationTimeoutId = setTimeout(() => this.dismiss(), Math.min(duration, MAX_TIMEOUT));
  }

  private _finishDismiss(): void {
    this._overlayRef.dispose();

    if (!this._onAction.closed) {
      this._onAction.complete();
    }

    this._afterDismissed.next({ dismissedByAction: this._dismissedByAction });
    this._afterDismissed.complete();
    this._dismissedByAction = false;
  }

  afterDismissed(): Observable<{
    dismissedByAction: boolean;
  }> {
    return this._afterDismissed;
  }

  /** Gets an observable that is notified when the snack bar has opened and appeared. */
  afterOpened(): Observable<void> {
    return this.containerInstance.onEnter;
  }

  /** Gets an observable that is notified when the snack bar action is called. */
  onAction(): Observable<void> {
    return this._onAction;
  }
}