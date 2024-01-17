import { ApplicationRef, ComponentRef, EmbeddedViewRef, Injector, createComponent, } from "@angular/core";
import { ComponentPortal, Portal } from "./portal";

type Positions = 'start' | 'center' | 'end';
export class OverlayPosition {
  private _overlayRef: OverlayRef;
  private _veticalPosition: Positions = 'end';
  private _horisontalPosition: Positions = 'center';
  constructor() { }

  setVericalPosition(position: Positions): void {
    this._veticalPosition = position;
  }

  setHorisontalPosition(position: Positions): void {
    this._horisontalPosition = position;
  }

  attach(overlayRef: OverlayRef): void {
    this._overlayRef = overlayRef;
  }

  apply(): void {
    this._overlayRef.hostElement.style.justifyContent = this._horisontalPosition;
    this._overlayRef.hostElement.style.alignItems = this._veticalPosition;
  }

  // dispose(): void {
  //   if (this._isDisposed || !this._overlayRef) {
  //     return;
  //   }

  //   const styles = this._overlayRef.overlayElement.style;
  //   const parent = this._overlayRef.hostElement;
  //   const parentStyles = parent.style;

  //   parent.classList.remove(wrapperClass);
  //   parentStyles.justifyContent =
  //     parentStyles.alignItems =
  //     styles.marginTop =
  //     styles.marginBottom =
  //     styles.marginLeft =
  //     styles.marginRight =
  //     styles.position =
  //       '';

  //   this._overlayRef = null!;
  //   this._isDisposed = true;
  // }
}

export class OverlayConfig {
  positioStrategy?: OverlayPosition;
  panelClass?: string | string[] = '';
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;

  constructor(config?: OverlayConfig) {
    if (config) {
      const configKeys = Object.keys(config) as Iterable<keyof OverlayConfig> &
        (keyof OverlayConfig)[];
      for (const key of configKeys) {
        if (config[key] !== undefined) {
          this[key] = config[key] as any;
        }
      }
    }
  }
}



export class OverlayRef {
  private _attachedPortal: Portal<any> | null;
  private _overlayConfig: OverlayConfig;
  private _host: HTMLElement;
  private _pane: HTMLElement;
  private _invokeDisposeComponentDestroyFn: (() => void) | null;

  constructor(
    overlayConfig: OverlayConfig,
    host: HTMLElement,
    pane: HTMLElement,
  ) {
    this._overlayConfig = overlayConfig;
    this._host = host;
    this._pane = pane;

    if (this._overlayConfig.positioStrategy) {
      this._overlayConfig.positioStrategy.attach(this);
      this._overlayConfig.positioStrategy.apply();
    }
  }

  get hostElement(): HTMLElement {
    return this._host;
  }

  get overlayElement(): HTMLElement {
    return this._pane;
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {

    let componentRef: ComponentRef<T>;
    if (portal.viewContainerRef) {
      componentRef = portal.viewContainerRef.createComponent(portal.component, {
        index: portal.viewContainerRef.length,
        injector: portal.injector || portal.viewContainerRef.injector,
      });

    } else {
      // створення екземпляру компоненту без viewContainerRef
      componentRef = createComponent(portal.component, {
        environmentInjector: portal.environmentInjector,
        elementInjector: portal.injector || Injector.NULL,
      });

      // https://gist.github.com/caroso1222/1c99aee8c9efe873902a9c590ab7b40a
      const _appRef = (portal.injector || Injector.NULL)!.get<ApplicationRef>(ApplicationRef);

      // Створений компонент додаємо до об'єкту Angular application який в даний момент запущено на сторінці
      // бо новий компонент створюється не в ViewContainer, а в body документу, тобто поза ангуляр додатку,
      // що робить недоступною стратегію відслідковування змін, тому ми повинні вручну додати компонент, 
      // до ангуляр додатку, який зараз запущений на сторінці
      _appRef.attachView(componentRef.hostView);
      // componentRef = componentFactory.create(
      //   portal.injector || Injector.NULL,
      // );
    }

    this._pane.appendChild(this._getComponentRootNode(componentRef));
    this._attachedPortal = portal;

    this._invokeDisposeComponentDestroyFn = () => componentRef.destroy();

    return componentRef;
  }

  dispose(): void {    
    if (this._invokeDisposeComponentDestroyFn) {
      this._invokeDisposeComponentDestroyFn();
      this._invokeDisposeComponentDestroyFn = null;
    }

    this._pane.remove();
    this._host.remove();
  }

  private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }
}