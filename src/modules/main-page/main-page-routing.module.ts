import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SliderTestComponent } from '../slider-test/components/slider-test/slider-test.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    // pathMatch: 'full',
    children: [
      {
        title: 'Тест слайдер',
        path: 'slider',
        loadChildren: () => import('../slider-test/slider-test.module').then(m => m.SliderTestModule),
        canActivate: []
      },
      {
        title: 'Менеджер парковки',
        path: 'parking-manager',
        loadChildren: () => import('../parking-manager/parking-manager.module').then(m => m.ParkingManagerModule),
        canActivate: []
      },
    ]
  },
] 

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainPageRoutingModule { }
