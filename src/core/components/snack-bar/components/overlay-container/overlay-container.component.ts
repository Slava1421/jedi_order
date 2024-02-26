import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, EmbeddedViewRef, HostBinding, Injector, NgZone, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { _SnackBarContainer } from '../../shared/snack-bar';
import { Subject, Observable, take } from 'rxjs';
import { TemplatePortal, ComponentPortal } from '../../shared/portal';
import { CzSnackBarConfig } from '../../shared/snack-bar-config';
import { CzSnackBarAnimations } from '../../animations/snackbar-animations';

@Component({
  selector: 'snk-overlay-container',
  templateUrl: './overlay-container.component.html',
  styleUrl: './overlay-container.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [CzSnackBarAnimations.snackBarState],
  host: {
    'class': 'snackbar-container',
    // '[@state]': '_animationState',
    '(@state.done)': 'onAnimationEnd($event)',
  },
})
export class OverlayContainerComponent implements _SnackBarContainer, OnDestroy {
  // snackBarConfig: CzSnackBarConfig<any>;

  readonly onExit: Subject<void> = new Subject();
  readonly onEnter: Subject<any> = new Subject();
  // _animationState = 'void';

  @HostBinding('@state') _animationState = 'void';

  @ViewChild('dynamicOutlet', { read: ViewContainerRef, static: true }) private _viewContainerRef: ViewContainerRef;
  constructor(
    private _injector: Injector,
    public snackBarConfig: CzSnackBarConfig,
    private _zone: NgZone,
    private _cd: ChangeDetectorRef
  ) {
    // https://medium.com/@zeeshankhan8838/dynamic-component-load-in-angular-b28c93c5c763
    //
    // When we dynamically create a component and insert it into the view by using a ViewContainerRef, 
    // Angular will invoke each one of the lifecycle hooks except for the ngOnChanges() hook.
    _zone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
      // _cd.detectChanges();
    });


    Promise.resolve().then(() => { this._animationState = 'visible'; })
  }
  ngOnDestroy(): void {
    
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    const ref = this._viewContainerRef.createComponent(portal.component, {
      index: this._viewContainerRef.length,
      injector: portal.injector || this._injector
    });

    return ref;
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    const viewRef = this._viewContainerRef.createEmbeddedView(portal.templateRef, portal.context, {
      injector: portal.injector,
    });
    return viewRef;
  }

  enter(): void {
    this._animationState = 'visible';
    this._cd.detectChanges();
  }

  exit(): Observable<void> {
    this._zone.run(() => {
      this._animationState = 'hidden';
    });

    return this.onExit;
  }

  /** Handle end of animations, updating the state of the snackbar. */
  onAnimationEnd(event: any) {
    const {fromState, toState} = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
      this._completeExit();
    }

    if (toState === 'visible') {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this.onEnter;

      this._zone.run(() => {
        onEnter.next(null);
        onEnter.complete();
      });
    }
  }

  private _completeExit() {
    this._zone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
      this._zone.run(() => {
        this.onExit.next();
        this.onExit.complete();
      });
    });
  }
}
