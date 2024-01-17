import { InjectionToken, ViewContainerRef } from '@angular/core';

export const SNACK_BAR_DATA = new InjectionToken<any>('CzSnackBarData');

export type CzSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
export type CzSnackBarVerticalPosition = 'top' | 'bottom';

export class CzSnackBarConfig<D = any> {
  announcementMessage?: string = '';
  viewContainerRef?: ViewContainerRef;
  // panelClass?: string | string[];
  duration?: number = 0;
  data?: D | null = null;
  horizontalPosition?: CzSnackBarHorizontalPosition = 'center';
  verticalPosition?: CzSnackBarVerticalPosition = 'bottom';
}
