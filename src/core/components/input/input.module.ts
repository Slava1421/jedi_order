import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzInputDirective } from './directives/cz-input.directive';

@NgModule({
  declarations: [
    CzInputDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [CzInputDirective]
})
export class InputModule { }
