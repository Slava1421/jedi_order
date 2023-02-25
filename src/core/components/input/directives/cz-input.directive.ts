import { Directive } from '@angular/core';

// input is not a closing tag, you need to use the directive

@Directive({
  selector: '[сzInput]'
})
export class CzInputDirective {

  constructor() { }

}
