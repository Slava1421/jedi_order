import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SliderTestComponent } from './components/slider-test/slider-test.component';

const routes: Routes = [
  {
    path: '',
    component: SliderTestComponent
  }
] 

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SliderTestRoutingModule { }
