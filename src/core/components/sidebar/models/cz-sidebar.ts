import { InjectionToken } from "@angular/core";
import { CzSidebarControllerService } from "../services/cz-sidebar-controller.service";

export const SIDEBAR_CONTROLLER = new InjectionToken<CzSidebarControllerService>('CzSidebarControllerService');