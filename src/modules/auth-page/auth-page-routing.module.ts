import { NgModule } from '@angular/core';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AuthPageComponent
  }
] 

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthPageRoutingModule { }
