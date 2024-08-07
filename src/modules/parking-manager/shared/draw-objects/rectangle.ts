import { generateUUID } from "src/core/helpers/tools";
import { Point } from "../../models/parking-manager.model";
import { _FillMixin } from "../mixins";

export class Rectangle extends _FillMixin {
  height: number;
  width: number;

  override _prefix: string = 'rectangle';

  constructor(ctx: CanvasRenderingContext2D | null = null) {
    super();

    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.lineWidth = 1;
    this.ctx = ctx;
    this.id = `${this._prefix}_${generateUUID()}`;
  }

  override setParams(start: Point, end: Point): void {
    const height = end.y - start.y;
    const width = end.x - start.x;
    this.height = Math.abs(height);
    this.width = Math.abs(width);
    // The height and width values can be negative, so we adjust the coordinates
    this.x = width < 0 ? start.x + width : start.x;
    this.y = height < 0 ? start.y + height : start.y;
  }

  override draw(ctx?: CanvasRenderingContext2D | null): void {
    if (!ctx && !this.ctx) {
      throw new Error('Draw error, provide context!');
    }
    const context = (ctx || this.ctx);

    this.setOutlineStyle(context);
    this.updFill(context);

    context!.beginPath();
    context!.rect(this.x, this.y, this.width, this.height);
    context!.stroke();
    
    if (this.fillColor) {
      context!.fill();
    }
  }

  override isHoverCursor(cursorPosition: Point): boolean {
    if (cursorPosition.x >= this.x && cursorPosition.x <= this.x + this.width &&
      cursorPosition.y >= this.y && cursorPosition.y <= this.y + this.height) {
      return true;
    }
    return false;
  }

  override sizeVerification(): boolean {
    return !(this.x === 0 && this.y === 0 && this.height === 0 && this.width === 0);
  }
}