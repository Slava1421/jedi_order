import { InjectionToken } from "@angular/core";
import { FormGroupDirective, NgControl, NgForm, UntypedFormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { ErrorStateMatcher } from "../../../error/error-option";
import { Constructor } from "../../button/models/constructor";

export function getCzInputUnsupportedTypeError(type: string): Error {
  return Error(`Input type "${type}" isn't supported by matInput.`);
}

export const INPUT_VALUE_ACCESSOR = new InjectionToken<{ value: any }>(
  'INPUT_VALUE_ACCESSOR',
);

export interface CanUpdateErrorState {
  updateErrorState(): void;
  errorState: boolean;
  errorStateMatcher: ErrorStateMatcher;
}

export interface HasErrorState {
  _parentFormGroup: FormGroupDirective;
  _parentForm: NgForm;
  _defaultErrorStateMatcher: ErrorStateMatcher;
  ngControl: NgControl;
  stateChanges: Subject<void>;
}

type InputErrorState = Constructor<CanUpdateErrorState>;

export function InputErrorState<T extends Constructor<HasErrorState>>(base: T): InputErrorState & T {
  return class extends base {
    errorState: boolean;
    errorStateMatcher: ErrorStateMatcher;
    updateErrorState(): void {
      const oldState = this.errorState;
      const parent = this._parentFormGroup || this._parentForm;
      const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      const control = this.ngControl ? (this.ngControl.control as UntypedFormControl) : null;
      const newState = matcher.isErrorState(control, parent);

      if (newState !== oldState) {
        this.errorState = newState;
        this.stateChanges.next();
      }
      
    }

    constructor(...args: any[]) {
      super(...args);
    }
  }
}

export const CzInputBase = InputErrorState(
  class {
    readonly stateChanges = new Subject<void>();

    constructor(
      public _defaultErrorStateMatcher: ErrorStateMatcher,
      public _parentForm: NgForm,
      public _parentFormGroup: FormGroupDirective,
      public ngControl: NgControl,
    ) {}
  },
);