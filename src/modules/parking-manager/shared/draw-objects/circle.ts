import { generateUUID } from "src/core/helpers/tools";
import { Point } from "../../models/parking-manager.model";
import { _FillMixin } from "../mixins";

export class Circle extends _FillMixin {
    radius: number;
    override _prefix: string = 'circle';
  
    constructor(ctx: CanvasRenderingContext2D | null = null) {
      super();
  
      this.x = 0;
      this.y = 0;
  
      this.radius = 0;
      this.lineWidth = 1;
      this.id = `${this._prefix}_${generateUUID()}`;

      this.ctx = ctx;
    }
  
    override setParams(start: Point, end: Point): void {
  
      this.x = (start.x + end.x) / 2;
      this.y = (start.y + end.y) / 2;
      this.radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) / 2;
    }
  
    override draw(ctx?: CanvasRenderingContext2D): void {
      if (!ctx && !this.ctx) {
        throw new Error('Draw error, provide context!');
      }
      const context = (ctx || this.ctx);
      
      this.setOutlineStyle(context);
      this.updFill(context);
  
      context!.beginPath();
      context!.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      context!.stroke();

      if (this.fillColor) {
        context!.fill();
      }
    }
  
    override isHoverCursor(cursorPosition: Point): boolean {
      return false;
    }
  
    override sizeVerification(): boolean {
      return !(this.x === 0 && this.y === 0 && this.radius === 0);
    }
  }