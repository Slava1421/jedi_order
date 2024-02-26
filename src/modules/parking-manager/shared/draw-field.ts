import { CircleParams, LineParams, Point, RectangleParams } from "../models/parking-manager.model";
import { CanvasInstance } from "./canvas-instance";

export class DrawParkingField {

  private _figures: Figure[] = [];
  public _canvas: CanvasInstance;
  public _ctx: CanvasRenderingContext2D | null;

  constructor(canvas: CanvasInstance) {

    if (!canvas) {
      throw new Error(`Isn't set canvas`);
    }

    this._canvas = canvas;
    this._ctx = canvas.context2D;
  }

  getState(): Figure[] {
    return this._figures;
  }

  draw(figure: Figure): void {
    if (!this._ctx) {
      return;
    }

    figure.draw(this._ctx);
  }

  highlightFigureOnHover(cursorPosition: Point): Figure | undefined {
    if (!this._ctx) {
      return undefined;
    }

    let result = undefined;

    for (let i = 0; i < this._figures.length; i++) {
      const isHover = this._figures[i].isHoverCursor(cursorPosition);

      if (isHover) {
        result = this._figures[i];
      }
    }

    return result;
  }

  saveFigure(figure: Figure): void {
    this._figures.push(figure);
    console.log(this._figures);
  }

  redraw(): void {
    this.clear();
    this._figures.forEach((item: Figure) => {
      this.draw(item);
    });
  }

  clear(): void {
    const { w, h } = this._canvas.getSizes();
    this._ctx?.save();
    this._ctx?.setTransform(1,0,0,1,0,0);
    this._ctx?.clearRect(0, 0, w, h);
    this._ctx?.restore();
  }
}

export type FigureInstance = LineParams | RectangleParams | CircleParams;

export abstract class Figure {
  x: number;
  y: number;

  bgColor: string = 'black';
  lineWidth: number;
  ctx: CanvasRenderingContext2D | null;

  constructor() { }

  abstract draw(ctx?: CanvasRenderingContext2D | null): void;
  abstract setParams(start: Point, end: Point): void;
  abstract isHoverCursor(cursorPosition: Point): boolean;
  abstract sizeVerification(): boolean;
}

export class Rectangle extends Figure {
  height: number;
  width: number;
  constructor(ctx: CanvasRenderingContext2D | null = null) {
    super();

    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.lineWidth = 1;
    this.ctx = ctx;
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

  override draw(ctx?: CanvasRenderingContext2D): void {    
    if (!ctx && !this.ctx) {
      throw new Error('Draw error, provide context!');
    }
    const context = (ctx || this.ctx);
    // this._ctx.setLineDash([5, 2]);// пунктир
    context!.strokeStyle = this.bgColor;
    context!.lineWidth = this.lineWidth;
    context!.beginPath();
    context!.strokeRect(this.x, this.y, this.width, this.height);
    context!.stroke();
  }

  override isHoverCursor(cursorPosition: Point): boolean {
    if (cursorPosition.x >= this.x && cursorPosition.x <= this.x + this.width &&
      cursorPosition.y >= this.y && cursorPosition.y <= this.y + this.height) {
      this.bgColor = 'red';
      return true;
    }
    this.bgColor = 'black';
    return false;
  }

  override sizeVerification(): boolean {
    return !(this.x === 0 && this.y === 0 && this.height === 0 && this.width === 0);
  }
}

export class Line extends Figure {
  xEnd: number;
  yEnd: number;
  constructor() {
    super();

    this.x = 0;
    this.y = 0;

    this.xEnd = 0;
    this.yEnd = 0;

    this.lineWidth = 1;
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
    context!.strokeStyle = this.bgColor;
    context!.lineWidth = this.lineWidth;
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

export class Circle extends Figure {
  radius: number;
  constructor() {
    super();

    this.x = 0;
    this.y = 0;

    this.radius = 0;

    this.lineWidth = 1;
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
    context!.strokeStyle = this.bgColor;
    context!.lineWidth = this.lineWidth;
    context!.beginPath();
    context!.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context!.stroke();
  }

  override isHoverCursor(cursorPosition: Point): boolean {
    return false;
  }

  override sizeVerification(): boolean {
    return !(this.x === 0 && this.y === 0 && this.radius === 0);
  }
}