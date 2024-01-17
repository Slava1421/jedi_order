import { AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, NgZone, OnDestroy, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';

import { CzSliderItemDefDirective } from '../../directives/cz-slider-item-def.directive';
import { Observable, Subject, filter, fromEvent, map, merge, mergeMap, takeUntil } from 'rxjs';
import { SLIDER_TOKEN } from '../../models/cz-slider';

@Component({
  selector: 'cz-slider',
  templateUrl: './cz-slider.component.html',
  styleUrls: ['./cz-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: SLIDER_TOKEN, useExisting: CzSliderComponent
  }]
})
export class CzSliderComponent implements AfterViewInit, OnDestroy {
  private _unsubscribe = new Subject();
  private _sliderEl: HTMLElement;
  private _height$: Observable<number>;


  public get sliderElement(): HTMLElement {
    return this._el.nativeElement;
  }

  currentVisibleItemIndex = 1;
  isAnimated = false;
  positionContainer: string;
  displayItems: CzSliderItemDefDirective[] = [];

  @ContentChildren(CzSliderItemDefDirective) items: QueryList<CzSliderItemDefDirective>;
  @ViewChild('itemContainer', { read: ElementRef }) itemContainer: ElementRef;
  @HostBinding('class.cz-slider') host = true;

  constructor(
    private _el: ElementRef,
    private _zone: NgZone
  ) {
    this._sliderEl = _el.nativeElement as HTMLElement;
    const transitionStart$ = fromEvent<TransitionEvent>(this._sliderEl, 'transitionstart');
    const transitionEnd$ = fromEvent<TransitionEvent>(this._sliderEl, 'transitionend');
    this._height$ = fromEvent(window, 'resize').pipe(
      map(() => this.sliderElement.clientHeight)
    );

    merge([transitionStart$, transitionEnd$])
      .pipe(
        mergeMap(r => r),
        filter(f => f.propertyName === 'top'),
        takeUntil(this._unsubscribe)
      ).subscribe({
        next: (val) => {
          this.isAnimated = val.type === 'transitionstart';

          if (val.type === 'transitionend') {

            if (this.currentVisibleItemIndex === 1) {
              this.positionContainer = `${Math.round((-this.currentVisibleItemIndex) * this._sliderEl.clientHeight)}px`;
            } else if (this.currentVisibleItemIndex === this.items.length) {
              this.positionContainer = `${Math.round((-this.currentVisibleItemIndex) * this._sliderEl.clientHeight)}px`;
            }

          }
        }
      });


    fromEvent<WheelEvent>(this._sliderEl, 'wheel')
      .pipe(
        filter(() => !this.isAnimated),
        map((e) => e.deltaY),
        takeUntil(this._unsubscribe),
      )
      .subscribe(deltaY => {
        this.isAnimated = true;

        if (deltaY > 0) {
          this.currentVisibleItemIndex++;
        } else if (deltaY < 0) {
          this.currentVisibleItemIndex--;
        }

        this.positionContainer = `${Math.round((-this.currentVisibleItemIndex) * this._sliderEl.clientHeight)}px`;
        
        if (this.currentVisibleItemIndex > this.items.length) {
          this.currentVisibleItemIndex = 1;
        } else if (this.currentVisibleItemIndex < 1) {
          this.currentVisibleItemIndex = this.items.length;
        }

      });

  }

  ngAfterViewInit(): void {
    Promise.resolve()
      .then(() => {
        this.displayItems = [this.items.last, ...this.items, this.items.first];
        this.positionContainer = `${Math.round((-this.currentVisibleItemIndex) * this._sliderEl.clientHeight)}px`;
      });

    this.createWindowResizeObserver((h: number) =>
      this.positionContainer = `${Math.round((-this.currentVisibleItemIndex) * h)}px`
    );
  }

  toItemPosition(index: number): void {
    this.isAnimated = true;
    this.currentVisibleItemIndex = index + 1;
    this.positionContainer = `${Math.round((-this.currentVisibleItemIndex) * this._sliderEl.clientHeight)}px`;
  }

  createWindowResizeObserver(callback: any) {
    this._height$.pipe(
      takeUntil(this._unsubscribe)
    ).subscribe(callback);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }



}
