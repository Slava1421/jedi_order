import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { AuthPageRoutingModule } from './auth-page-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '../../core/components/button/button.module';
import { InputModule } from '../../core/components/input/input.module';
import { FormFieldModule } from '../../core/components/form-field/form-field.module';



@NgModule({
  declarations: [
    AuthPageComponent
  ],
  imports: [
    CommonModule,
    AuthPageRoutingModule,
    InputModule,
    ReactiveFormsModule,
    FormFieldModule,
    ButtonModule
  ]
})
export class AuthPageModule { }
