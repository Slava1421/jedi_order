import { Observable } from 'rxjs';
import { AbstractControlDirective, NgControl } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive()
export abstract class MatFormFieldControl<T> {
  value: T | null;
  readonly stateChanges: Observable<void>;
  readonly controlType?: string;
  readonly id: string;
  readonly placeholder: string;
  readonly ngControl: NgControl | AbstractControlDirective | null;
  readonly focused: boolean;
  readonly empty: boolean;
  readonly required: boolean;
  readonly disabled: boolean;
  readonly autofilled?: boolean;
  readonly errorState: boolean;
  abstract onContainerClick(event: MouseEvent): void;
}
