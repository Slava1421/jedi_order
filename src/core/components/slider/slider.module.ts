import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzSliderComponent } from './components/cz-slider/cz-slider.component';
import { CzSliderItemComponent } from './components/cz-slider-item/cz-slider-item.component';
import { CzSliderItemDefDirective } from './directives/cz-slider-item-def.directive';



@NgModule({
  declarations: [
    CzSliderComponent,
    CzSliderItemComponent,
    CzSliderItemDefDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CzSliderComponent,
    CzSliderItemComponent,
    CzSliderItemDefDirective
  ]
})
export class SliderModule { }
