import { ComponentFactoryResolver, ComponentRef, ElementRef, EmbeddedViewRef, EnvironmentInjector, Injector, TemplateRef, ViewContainerRef } from "@angular/core";
import { ComponentType } from "./snack-bar";

export abstract class Portal<T> {
    private _attachedHost: PortalOutlet | null;
  
    attach(host: PortalOutlet): T {
  
      this._attachedHost = host;
      return <T>host.attach(this);
    }
  
    detach(): void {
      let host = this._attachedHost;
  
      if (host != null) {
        this._attachedHost = null;
        host.detach();
      } 
    }
  
    get isAttached(): boolean {
      return this._attachedHost != null;
    }
  
    setAttachedHost(host: PortalOutlet | null) {
      this._attachedHost = host;
    }
  }
  
  export class ComponentPortal<T> extends Portal<ComponentRef<T>> {
    component: ComponentType<T>;
    viewContainerRef?: ViewContainerRef | null;
    injector?: Injector | null;
    environmentInjector: EnvironmentInjector;
  
    constructor(
      component: ComponentType<T>,
      environmentInjector: EnvironmentInjector,
      viewContainerRef?: ViewContainerRef | null,
      injector?: Injector | null,
    ) {
      super();
      this.component = component;
      this.viewContainerRef = viewContainerRef;
      this.injector = injector;
      this.environmentInjector = environmentInjector;
    }
  }
  
  export class TemplatePortal<C = any> extends Portal<EmbeddedViewRef<C>> {
    constructor(
      public templateRef: TemplateRef<C>,
      public viewContainerRef: ViewContainerRef,
      public context?: C,
      public injector?: Injector,
    ) {
      super();
    }
  
    get origin(): ElementRef {
      return this.templateRef.elementRef;
    }
    
    override attach(host: PortalOutlet, context: C | undefined = this.context): EmbeddedViewRef<C> {
      this.context = context;
      return super.attach(host);
    }
  
    override detach(): void {
      this.context = undefined;
      return super.detach();
    }
  }

  export interface PortalOutlet {
    attach(portal: Portal<any>): any;
    detach(): any;
    dispose(): void;
    hasAttached(): boolean;
  }