import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzSidebarComponent } from './components/cz-sidebar/cz-sidebar.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { NavHeadComponent } from './components/nav-head/nav-head.component';
import { NavContentComponent } from './components/nav-content/nav-content.component';
import { IconModule } from '../icon/icon.module';
import { NavFooterComponent } from './components/nav-footer/nav-footer.component';
import { CzSidebarControllerService } from './services/cz-sidebar-controller.service';
import { SIDEBAR_CONTROLLER } from './models/cz-sidebar';

@NgModule({
  declarations: [
    CzSidebarComponent,
    NavItemComponent,
    NavHeadComponent,
    NavContentComponent,
    NavFooterComponent
  ],
  imports: [
    CommonModule,
    IconModule
  ],
  exports: [
    CzSidebarComponent,
    NavItemComponent,
    NavContentComponent,
    NavHeadComponent,
    NavFooterComponent
  ],
  providers: [{
    provide: SIDEBAR_CONTROLLER, useClass: CzSidebarControllerService
  }]
})
export class SidebarModule {
  static forRoot(): ModuleWithProviders<SidebarModule> {
    return {
      ngModule: SidebarModule,
      providers: [CzSidebarControllerService]
    };
  }
}
