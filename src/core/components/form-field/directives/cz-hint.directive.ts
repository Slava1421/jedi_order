import { Directive, InjectionToken, Input } from '@angular/core';

const CZ_HINT_TOKEN = new InjectionToken<CzHintDirective>('czHint');

@Directive({
  selector: 'cz-hint',
  host: {
    'class': 'cz-hint',
    '[class.cz-form-field-hint-end]': 'align === "end"',
  },
  providers: [
    { provide: CZ_HINT_TOKEN, useExisting: CzHintDirective }
  ]
})
export class CzHintDirective {

  @Input() align: 'start' | 'end' = 'start';

  constructor() {}

}
