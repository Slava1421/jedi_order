import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, InjectionToken, QueryList, ViewEncapsulation } from '@angular/core';
import { AbstractControlDirective } from '@angular/forms';
import { startWith } from 'rxjs';
import { CzError, CZ_ERROR } from '../../directives/error';
import { CzLabelDirective } from '../../directives/label';
import { CzPrefixDirective, CZ_PREFIX } from '../../directives/prefix';
import { CzSuffixDirective, CZ_SUFFIX } from '../../directives/suffix';
import { MatFormFieldControl } from '../../shared/form-field-control';

export const CZ_FORM_FIELD = new InjectionToken<CzFormFieldComponent>('CZ_FORM_FIELD');

@Component({
  selector: 'cz-form-field',
  templateUrl: './cz-form-field.component.html',
  styleUrls: ['./cz-form-field.component.scss'],
  host: {
    'class': 'cz-form-field',
    '[class.ng-untouched]': 'shouldForward("untouched")',
    '[class.ng-touched]': 'shouldForward("touched")',
    '[class.ng-pristine]': 'shouldForward("pristine")',
    '[class.ng-dirty]': 'shouldForward("dirty")',
    '[class.ng-valid]': 'shouldForward("valid")',
    '[class.ng-invalid]': 'shouldForward("invalid")',
    '[class.ng-pending]': 'shouldForward("pending")',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CZ_FORM_FIELD, useExisting: CzFormFieldComponent }],
})
export class CzFormFieldComponent implements AfterContentInit {
  @ContentChild(MatFormFieldControl) control: MatFormFieldControl<any>;
  @ContentChild(CzLabelDirective) labelChild: CzLabelDirective;
  @ContentChildren(CZ_PREFIX, { descendants: true }) prefixChildren: QueryList<CzPrefixDirective>;
  @ContentChildren(CZ_SUFFIX, { descendants: true }) suffixChildren: QueryList<CzSuffixDirective>;
  @ContentChildren(CZ_ERROR, { descendants: true }) errorChildren: QueryList<CzError>;

  get hasLabel(): boolean {
    return (!!this.control?.placeholder || !!this.labelChild);
  }

  get value(): string {
    return this.control?.value as string;
  }

  constructor(private _cd: ChangeDetectorRef) { }

  ngAfterContentInit(): void {
    if (this.control.ngControl && this.control.ngControl.valueChanges) {
      this.control.stateChanges.pipe(startWith(null)).subscribe(() => {
        this._cd.markForCheck();
      });
    }
  }

  onContainerClick(event: MouseEvent): void {
    this.control.onContainerClick(event);
  }

  shouldForward(prop: keyof AbstractControlDirective): boolean {
    const control = this.control ? this.control.ngControl : null;
    return control && control[prop];
  }

  getDisplayedMessages(): 'error' | 'hint' {
    
    return this.errorChildren && this.errorChildren.length > 0 && this.control.errorState
      ? 'error'
      : 'hint';
  }
}
