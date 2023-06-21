import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MainPageRoutingModule } from './main-page-routing.module';
import { ButtonModule } from '../../core/components/button/button.module';
import { InputModule } from '../../core/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule } from '../../core/components/form-field/form-field.module';
import { IconModule } from '../../core/components/icon/icon.module';
import { SidebarModule } from '../../core/components/sidebar/sidebar.module';
import { UkrainianMapModule } from '../ukrainian-map/ukrainian-map.module';
import { EditableModule } from '../editable/editable.module';



@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    ButtonModule,
    InputModule,
    ReactiveFormsModule,
    FormFieldModule,
    IconModule,
    SidebarModule,
    UkrainianMapModule,
    EditableModule
  ]
})
export class MainPageModule { }
