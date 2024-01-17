import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultSnackBarComponent } from './components/default-snack-bar/default-snack-bar.component';
import { OverlayContainerComponent } from './components/overlay-container/overlay-container.component';



@NgModule({
  declarations: [DefaultSnackBarComponent, OverlayContainerComponent],
  imports: [
    CommonModule
  ],
  exports: [OverlayContainerComponent]
})
export class SnackBarModule { }
