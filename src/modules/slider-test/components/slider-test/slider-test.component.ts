import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { SliderModule } from '../../../../core/components/slider/slider.module';

@Component({
  selector: 'app-slider-test',
  standalone: true,
  imports: [SliderModule],
  templateUrl: './slider-test.component.html',
  styleUrl: './slider-test.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SliderTestComponent {
  @HostBinding('class.slider-wrapper') item = true;
}
