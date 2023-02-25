import { ElementRef } from "@angular/core";

export type Constructor<T> = new (...args: any[]) => T;

/**
 * This is a permissive type for abstract class constructors.
 */
export type AbstractConstructor<T = object> = abstract new (...args: any[]) => T;

type CanDisableCtor = Constructor<CanDisable> & AbstractConstructor<CanDisable>;

export interface CanDisable {
	disabled: boolean;
}
/** Mixin to augment a directive with a `disabled` property. */
export function mixinDisabled<T extends Constructor<{}>>(base: T): CanDisableCtor & T {
	return class extends base {
		private _disabled: boolean = false;


		get disabled(): boolean {
			return this._disabled;
		}
		set disabled(value: any) {
			console.log(base, 'dssssssdd');
			this._disabled = coerceBooleanProperty(value);
		}

		constructor(...args: any[]) {
			super(...args);
		}
	};
}

/** Coerces a data-bound value (typically a string) to a boolean. */
export function coerceBooleanProperty(value: any): boolean {
	return value != null && `${value}` !== 'false';
}

export const _MatButtonMixin = mixinDisabled(class {
	constructor(public _elementRef: ElementRef) { }
},);
