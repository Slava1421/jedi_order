import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidebarThemes } from '../models/cz-sidebar';

@Injectable({providedIn: 'root'})
export class CzSidebarControllerService {

  collapsed$ = new BehaviorSubject<boolean>(false);
  themeState$ = new BehaviorSubject<SidebarThemes>(SidebarThemes.LIGHT);

  collapsedToggle(): boolean {
    this.collapsed$.next(!this.collapsed$.value);
    return this.collapsed$.value;
  }
  
  themeToggle(theme: SidebarThemes): SidebarThemes {
    this.themeState$.next(theme);
    return this.themeState$.value;
  }
}
