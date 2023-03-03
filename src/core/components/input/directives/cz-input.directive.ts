import { Directive, DoCheck, ElementRef, HostBinding, Input, Optional, Self } from '@angular/core';
import { AbstractControlDirective, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ErrorStateMatcher } from 'src/core/error/error-option';
import { MatFormFieldControl as CzFormFieldControl } from '../../form-field/shared/form-field-control';
import { CzInputBase, getCzInputUnsupportedTypeError } from '../shared/input';

let nextUniqueId = 0;

const MAT_INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
];

const candidateInputTypes = new Set([
  'color',
  'date',
  'datetime-local',
  'email',
  'month',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
  'week',
]);

@Directive({
  selector: '[czInput]',
  host: {
    'class': 'cz-input',
    '(focus)': '_focusChanged(true)',
    '(blur)': '_focusChanged(false)',
    '(input)': '_onInput()',
  },
  providers: [{ provide: CzFormFieldControl, useExisting: CzInputDirective }],
})
export class CzInputDirective extends CzInputBase implements CzFormFieldControl<any>, DoCheck {
  private _inputValueAccessor: { value: any };
  protected _previousNativeValue: any;
  // readonly stateChanges = new Subject<void>();

  protected _uid = `cz-input-${nextUniqueId++}`;
  @Input() placeholder: string;

  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value || 'text';
    this._validateType();

    if (candidateInputTypes.has(this._type)) {
      (this._elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
  }
  protected _type = 'text';


  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  protected _id: string = this._uid;

  @Input()
  get value(): string {
    return this._inputValueAccessor.value;
  }
  set value(value: any) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  @Input() focused: boolean;
  @Input() empty: boolean;
  @Input() required: boolean;
  @Input() disabled: boolean;

  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    protected _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    this._inputValueAccessor = _elementRef.nativeElement;
    this._previousNativeValue = this.value;

  }
  ngDoCheck(): void {
    if (this.ngControl) {
      this.updateErrorState();
    }
    this._dirtyCheckNativeValue();
  }

  onContainerClick(event: MouseEvent): void {
    if (!this.focused) {
      this.focus();
    }
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  protected _validateType() {
    if (
      MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1
    ) {
      throw getCzInputUnsupportedTypeError(this._type);
    }
  }

  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this.stateChanges.next();
    }

  }

  _onInput() {

  }
}
