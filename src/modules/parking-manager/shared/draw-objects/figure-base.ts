import { Point } from "../../models/parking-manager.model";

export abstract class FigureBase {
    x: number;
    y: number;
  
    lineWidth: number;
    ctx: CanvasRenderingContext2D | null;
    id: string;
    lineColor: string;
  
    // fillColor: string;
    zIndex: number;
    readonly defaultLineColor: string = 'black';
  
  
    protected abstract _prefix: string;
  
    constructor() {
      this.lineColor = this.defaultLineColor;
    }
  
    abstract draw(ctx?: CanvasRenderingContext2D | null): void;
    abstract setParams(start: Point, end: Point): void;
    abstract isHoverCursor(cursorPosition: Point): boolean;
    abstract sizeVerification(): boolean;
  
    public setLineColor(color: string = this.defaultLineColor): void {
      this.lineColor = color;
    }
  
    protected setOutlineStyle(ctx: CanvasRenderingContext2D | null): void {
  
      ctx!.strokeStyle = this.lineColor;
      ctx!.lineWidth = this.lineWidth;
    }
  }