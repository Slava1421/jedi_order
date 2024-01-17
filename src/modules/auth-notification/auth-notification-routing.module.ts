import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthNotificationComponent } from './components/auth-notification/auth-notification.component';

const routes: Routes = [
  {
    path: '',
    component: AuthNotificationComponent
  }
] 

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthNotificationRoutingModule { }
