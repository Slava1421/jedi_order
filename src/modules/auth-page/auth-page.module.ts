import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { AuthPageRoutingModule } from './auth-page-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '../../core/components/button/button.module';



@NgModule({
  declarations: [
    AuthPageComponent
  ],
  imports: [
    CommonModule,
    AuthPageRoutingModule,
    ReactiveFormsModule,
    ButtonModule
  ]
})
export class AuthPageModule { }
