import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingManagerRoutingModule } from './parking-manager-routing.module';
import { ParkingManagerComponent } from './componets/parking-manager/parking-manager.component';



@NgModule({
  declarations: [ParkingManagerComponent],
  imports: [
    CommonModule,
    ParkingManagerRoutingModule
  ]
})
export class ParkingManagerModule { }
