import { ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, EnvironmentInjector, Inject, Injectable, Injector, OnDestroy, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { CZ_SNACK_BAR_DATA, CZ_SNACK_BAR_DEFAULT_OPTIONS, ComponentType, CzSnackBarRef, _SnackBarContainer } from '../shared/snack-bar';
import { CzSnackBarConfig } from '../shared/snack-bar-config';
import { CzOverlayContainer } from './overlay-container';
import { OverlayConfig, OverlayPosition, OverlayRef } from '../shared/overlay-ref';
import { DOCUMENT } from '@angular/common';
import { OverlayContainerComponent } from '../components/overlay-container/overlay-container.component';
import { ComponentPortal, TemplatePortal } from '../shared/portal';
import { DefaultSnackBarComponent, TextOnlySnackBar } from '../components/default-snack-bar/default-snack-bar.component';

let nextUniqueId = 0;

@Injectable()
export class CzSnackBarService implements OnDestroy{
  protected snackBarContainerComponent = OverlayContainerComponent;
  protected defaultSimpleSnackBarComponent = DefaultSnackBarComponent;
  /**
     * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
     * If there is a parent snack-bar service, all operations should delegate to that parent
     * via `_openedSnackBarRef`.
     */
  private _snackBarRefAtThisLevel: CzSnackBarRef<any> | null = null;
  /** Reference to the currently opened snackbar at *any* level. */
  get _openedSnackBarRef(): CzSnackBarRef<any> | null {
    const parent = this._parentSnackBar;
    return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
  }

  set _openedSnackBarRef(value: CzSnackBarRef<any> | null) {
    if (this._parentSnackBar) {
      this._parentSnackBar._openedSnackBarRef = value;
    } else {
      this._snackBarRefAtThisLevel = value;
    }
  }

  constructor(
    @Inject(CZ_SNACK_BAR_DEFAULT_OPTIONS) private _defaultConfig: CzSnackBarConfig,
    @Inject(DOCUMENT) private _document: Document,
    @Optional() @SkipSelf() private _parentSnackBar: CzSnackBarService,
    private _overlayContainer: CzOverlayContainer,
    private _injector: Injector,
    private _environmentInjector: EnvironmentInjector,
  ) { }

  openFromComponent<T, D = any>(
    component: ComponentType<T>,
    config?: CzSnackBarConfig<D>,
  ): CzSnackBarRef<T> {
    return this._attach(component, config) as CzSnackBarRef<T>;
  }

  openFromTemplate(
    template: TemplateRef<any>,
    config?: CzSnackBarConfig,
  ): CzSnackBarRef<EmbeddedViewRef<any>> {
    return this._attach(template, config);
  }


  open(
    message: string,
    action: string = '',
    config?: CzSnackBarConfig,
  ): CzSnackBarRef<TextOnlySnackBar> {
    const _config = {...this._defaultConfig, ...config};

    _config.data = {message, action};
    if (_config.announcementMessage === message) {
      _config.announcementMessage = undefined;
    }

    return this.openFromComponent(this.defaultSimpleSnackBarComponent, _config);
  }

  private _attach<T>(
    content: ComponentType<T> | TemplateRef<T>,
    userConfig?: CzSnackBarConfig,
  ): CzSnackBarRef<T | EmbeddedViewRef<any>> {

    const config = { ...new CzSnackBarConfig(), ...this._defaultConfig, ...userConfig };
    const overlayRef = this._createOverlay(config);
    const containerRef = this._attachSnackBarContainer(overlayRef, config);
    const snackBarRef = new CzSnackBarRef<T | EmbeddedViewRef<any>>(containerRef, overlayRef);

    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null!, {
        $implicit: config.data,
        containerRef,
      } as any);

      snackBarRef.instance = containerRef.attachTemplatePortal(portal);
    } else {
      const injector = this._createInjector(config, snackBarRef);
      const portal = new ComponentPortal(content, this._environmentInjector, null, injector);
      const contentRef = containerRef.attachComponentPortal<T>(portal);
      this._animateSnackBar(snackBarRef, config);
      snackBarRef.instance = contentRef.instance;
    }

    this._openedSnackBarRef = snackBarRef;
    return this._openedSnackBarRef;
  }

  private _createOverlay(config: CzSnackBarConfig): OverlayRef {
    const host = this._createHostElement();
    const pane = this._createPaneElement(host);
    const overlayConfig = new OverlayConfig();
    const position = new OverlayPosition();

    const horisontal =
      config.horizontalPosition === 'left' || config.horizontalPosition === 'start' ? 'start' :
        config.horizontalPosition === 'right' || config.horizontalPosition === 'end' ? 'end' : 'center';
    const vertical =
      config.verticalPosition === 'top' ? 'start' : 'end'

    position.setHorisontalPosition(horisontal);
    position.setVericalPosition(vertical);

    overlayConfig.positioStrategy = position;

    return new OverlayRef(overlayConfig, host, pane);
  }

  private _createHostElement(): HTMLElement {
    const host = this._document.createElement('div');
    host.classList.add('cz-overlay-wrapper')
    this._overlayContainer.getContainerElement().appendChild(host);
    return host;
  }

  private _createPaneElement(host: HTMLElement): HTMLElement {
    const pane = this._document.createElement('div');

    pane.id = `cz-overlay-${nextUniqueId++}`;
    pane.classList.add('cz-overlay-pane');
    host.appendChild(pane);

    return pane;
  }

  private _attachSnackBarContainer(
    overlayRef: OverlayRef,
    config: CzSnackBarConfig,
  ): _SnackBarContainer {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{ provide: CzSnackBarConfig, useValue: config }],
    });

    const containerPortal = new ComponentPortal(
      this.snackBarContainerComponent,
      this._environmentInjector,
      config.viewContainerRef,
      injector
    );

    const containerRef: ComponentRef<_SnackBarContainer> = overlayRef.attachComponentPortal<_SnackBarContainer>(containerPortal);

    containerRef.instance.snackBarConfig = config;
    return containerRef.instance;
  }

  private _animateSnackBar(snackBarRef: CzSnackBarRef<any>, config: CzSnackBarConfig) {
    snackBarRef.afterDismissed().subscribe(() => {
      // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
      if (this._openedSnackBarRef == snackBarRef) {
        this._openedSnackBarRef = null;
      }
    });

    if (this._openedSnackBarRef) {
      // If a snack bar is already in view, dismiss it and enter the
      // new snack bar after exit animation is complete.
      this._openedSnackBarRef.afterDismissed().subscribe(() => {
        snackBarRef.containerInstance.enter();
      });
      this._openedSnackBarRef.dismiss();
    } else {
      // If no snack bar is in view, enter the new snack bar.
      snackBarRef.containerInstance.enter();
    }
    
    // snackBarRef.containerInstance.enter();

    if (config.duration && config.duration > 0) {
      snackBarRef.afterOpened().subscribe(() => snackBarRef._dismissAfter(config.duration!));
    }
  }

  private _createInjector<T>(config: CzSnackBarConfig, snackBarRef: CzSnackBarRef<T>): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    return Injector.create({
      parent: userInjector || this._injector,
      providers: [
        { provide: CzSnackBarRef, useValue: snackBarRef },
        { provide: CZ_SNACK_BAR_DATA, useValue: config.data },
      ],
    });
  }

  ngOnDestroy() {
    // Only dismiss the snack bar at the current level on destroy.
    if (this._snackBarRefAtThisLevel) {
      this._snackBarRefAtThisLevel.dismiss();
    }
  }
}
