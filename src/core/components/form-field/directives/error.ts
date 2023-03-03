import { Directive, InjectionToken, Input } from '@angular/core';

let nextUniqueId = 0;
export const CZ_ERROR = new InjectionToken<CzError>('CzError');

@Directive({
  selector: 'cz-error',
  host: {
    'class': 'cz-error',
    '[attr.id]': 'id',
  },
  providers: [{ provide: CZ_ERROR, useExisting: CzError }],
})
export class CzError {
  @Input() id: string = `cz-error-${nextUniqueId++}`;

  constructor() { }
}
