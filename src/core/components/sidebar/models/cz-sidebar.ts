import { InjectionToken } from "@angular/core";
import { CzSidebarComponent } from "../components/cz-sidebar/cz-sidebar.component";
import { CzSidebarControllerService } from "../services/cz-sidebar-controller.service";

export const SIDEBAR_CONTROLLER = new InjectionToken<CzSidebarControllerService>('CzSidebarControllerService');
export const SIDEBAR_TOKEN = new InjectionToken<CzSidebarComponent>('SIDEBAR');

export enum SidebarThemes {
  LIGHT = 'light',
  DARK = 'dark',
}