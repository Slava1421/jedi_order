import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzFormFieldComponent } from './components/cz-form-field/cz-form-field.component';
import { CzHintDirective } from './directives/cz-hint.directive';
import { CzSuffixDirective } from './directives/suffix';
import { CzPrefixDirective } from './directives/prefix';
import { CzLabelDirective } from './directives/label';
import { CzError } from './directives/error';



@NgModule({
  declarations: [
    CzFormFieldComponent,
    CzHintDirective,
    CzSuffixDirective,
    CzPrefixDirective,
    CzLabelDirective,
    CzError
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CzFormFieldComponent,
    CzHintDirective,
    CzSuffixDirective,
    CzPrefixDirective,
    CzLabelDirective,
    CzError
  ]
})
export class FormFieldModule { }
