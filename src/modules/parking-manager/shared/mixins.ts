import { FigureBase } from "./draw-objects/figure-base";

export type Constructor<T> = new (...args: any[]) => T;
export type AbstractConstructor<T = object> = abstract new (...args: any[]) => T;

type CanFillCtor =  AbstractConstructor<CanFill>;

export interface CanFill {
  fillColor: string;
  setFillСolor: (color: string) => void;
  updFill: (ctx: CanvasRenderingContext2D | null) => void;
}
/** Mixin to augment a directive with a `disabled` property. */
// export function mixinFill<T extends Constructor<{}>>(base: T): CanFillCtor & T;
export function mixinFill<T extends AbstractConstructor<{}>>(base: T): CanFillCtor & T {
  abstract class Fill extends base {
    public fillColor: string;

    public setFillСolor(color: string): void {
      this.fillColor = color;
    }

    public updFill(ctx: CanvasRenderingContext2D | null): void {
      if (!!this.fillColor) {
        ctx!.fillStyle = this.fillColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };

  return Fill;
}

export const _FillMixin = mixinFill(FigureBase);
