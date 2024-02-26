import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParkingManagerComponent } from './componets/parking-manager/parking-manager.component';

const routes: Routes = [
  {
    path: '',
    component: ParkingManagerComponent
  }
] 

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ParkingManagerRoutingModule { }
