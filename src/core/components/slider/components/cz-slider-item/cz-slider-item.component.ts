import { AfterViewInit, Component, ElementRef, HostBinding, Inject, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { SLIDER_TOKEN } from '../../models/cz-slider';
import { CzSliderComponent } from '../cz-slider/cz-slider.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'cz-slider-item',
  templateUrl: './cz-slider-item.component.html',
  styleUrls: ['./cz-slider-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CzSliderItemComponent implements AfterViewInit, OnDestroy {
  private _unsubscribe = new Subject();

  @HostBinding('class.cz-slider__item') item = true;

  constructor(
    @Inject(SLIDER_TOKEN) private slider: CzSliderComponent,
    private renderer: Renderer2,
    private _elementRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this._elementRef.nativeElement, 'height', `${Math.round(this.slider.sliderElement.clientHeight)}px`);

    this.slider.createWindowResizeObserver((h: number) =>
      this.renderer.setStyle(this._elementRef.nativeElement, 'height', `${Math.round(h)}px`)
    );
  }

  ngOnDestroy() {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
