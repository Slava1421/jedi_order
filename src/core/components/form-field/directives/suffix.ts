import {Directive, InjectionToken} from '@angular/core';

export const CZ_SUFFIX = new InjectionToken<CzSuffixDirective>('CzSuffixDirective');
@Directive({
  selector: '[czSuffix]',
  providers: [{provide: CZ_SUFFIX, useExisting: CzSuffixDirective}],
})
export class CzSuffixDirective {}
