import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzButtonComponent } from './components/cz-button/cz-button.component';



@NgModule({
  declarations: [
    CzButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [CzButtonComponent]
})
export class ButtonModule { }
