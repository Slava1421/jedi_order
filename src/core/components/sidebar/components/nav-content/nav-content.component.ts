import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'sidebar__content'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavContentComponent {

}
