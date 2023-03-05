import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cz-icon',
  templateUrl: './cz-icon.component.html',
  styleUrls: ['./cz-icon.component.scss'],
  host: {
    'class': 'icon-container',
    '[class.size__12]': 'size === 12',
    '[class.size__24]': 'size === 24',
    '[class.size__32]': 'size === 32'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CzIconComponent {
  @Input() size: 12 | 24 | 32 = 24;
  @Input() src = '';
}
