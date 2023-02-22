import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    title: 'Авторизація',
    path: 'auth',
    loadChildren: () => import('../modules/auth-page/auth-page.module').then(m => m.AuthPageModule),
    canActivate: []
  },
  {
    title: 'Головна сторінка',
    path: 'main',
    loadChildren: () => import('../modules/main-page/main-page.module').then(m => m.MainPageModule),
    canActivate: []
  },
  {
    path: '**',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
