import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, OnDestroy} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CzOverlayContainer implements OnDestroy {
  protected _containerElement: HTMLElement;

  constructor(@Inject(DOCUMENT) private _document: any) {
  }

  ngOnDestroy() {
    this._containerElement?.remove();
  }

  getContainerElement(): HTMLElement {
    if (!this._containerElement) {
      this._createContainer();
    }

    return this._containerElement;
  }

  protected _createContainer(): void {
    const containerClass = 'cz-overlay-container';

    const container = this._document.createElement('div');
    container.classList.add(containerClass);

    this._document.body.appendChild(container);
    this._containerElement = container;
  }
}
