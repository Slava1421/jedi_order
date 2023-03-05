import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzIconComponent } from './components/cz-icon/cz-icon.component';



@NgModule({
  declarations: [
    CzIconComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [CzIconComponent]
})
export class IconModule { }
