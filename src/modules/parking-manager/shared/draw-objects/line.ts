import { generateUUID } from "src/core/helpers/tools";
import { FigureBase } from "./figure-base";
import { Point } from "../../models/parking-manager.model";

export class Line extends FigureBase {
    xEnd: number;
    yEnd: number;
  
    override _prefix: string = 'line';
  
    constructor(ctx: CanvasRenderingContext2D | null = null) {
      super();
      this.x = 0;
      this.y = 0;
  
      this.xEnd = 0;
      this.yEnd = 0;
  
      this.lineWidth = 1;
      this.id = `${this._prefix}_${generateUUID()}`;

      this.ctx = ctx;
    }
  
    override setParams(start: Point, end: Point): void {
      this.x = start.x;
      this.y = start.y;
      this.xEnd = end.x;
      this.yEnd = end.y;
    }
  
    override draw(ctx?: CanvasRenderingContext2D): void {
      if (!ctx && !this.ctx) {
        throw new Error('Draw error, provide context!');
      }
      const context = (ctx || this.ctx);
      
      this.setOutlineStyle(context);
      
      context!.beginPath();
      context!.moveTo(this.x, this.y);
      context!.lineTo(this.xEnd, this.yEnd);
      context!.stroke();
    }
  
    override isHoverCursor(cursorPosition: Point): boolean {
      return false;
    }
  
    override sizeVerification(): boolean {
      return !(this.x === 0 && this.y === 0 && this.xEnd === 0 && this.yEnd === 0);
    }
  }