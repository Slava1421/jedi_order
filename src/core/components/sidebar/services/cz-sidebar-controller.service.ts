import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CzSidebarControllerService {

  collapsed$ = new BehaviorSubject<boolean>(false);

  collapsedToggle(): boolean {
    this.collapsed$.next(!this.collapsed$.value);
    return this.collapsed$.value;
  }
}
