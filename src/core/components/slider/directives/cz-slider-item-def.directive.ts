import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[czSliderItemDef]'
})
export class CzSliderItemDefDirective {

  constructor(public tpl: TemplateRef<any>) {
  }

}
