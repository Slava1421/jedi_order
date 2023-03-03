import {Directive, InjectionToken} from '@angular/core';

export const CZ_PREFIX = new InjectionToken<CzPrefixDirective>('CzPrefix');

/** Prefix to be placed in front of the form field. */
@Directive({
  selector: '[czPrefix]',
  providers: [{provide: CZ_PREFIX, useExisting: CzPrefixDirective}],
})
export class CzPrefixDirective {}
