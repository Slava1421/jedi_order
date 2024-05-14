import { Observable, Subject, fromEvent, takeUntil } from "rxjs";
import { Point } from "../models/parking-manager.model";
import { Renderer2 } from "@angular/core";

const WIDTH = 600;
const HEIGHT = 300;
// const PADDING = 40
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
// const VIEW_HEIGHT = DPI_HEIGHT;// - PADDING * 2
// const VIEW_WIDTH = DPI_WIDTH

export class CanvasInstance {

  private _canvasMouseDown$: Observable<MouseEvent>;
  private _canvasMouseMove$: Observable<MouseEvent>;
  private _canvasMouseUp$: Observable<MouseEvent>;
  private _canvasMouseOut$: Observable<MouseEvent>;
  private _canvasMouseWheel$: Observable<WheelEvent>;
  private _windowResize$: Observable<MouseEvent>;
  private _unsubscribe$ = new Subject();
  private _renderer: Renderer2;

  private _size: { height: number, width: number } = { height: 0, width: 0 };

  /** Canvas HTML element. */
  public canvas: HTMLCanvasElement;
  /** 2D context . */
  public context2D: CanvasRenderingContext2D | null;
  public rect: DOMRect;

  /**Ratio of HTML canvas dimensions to its context dimensions */
  public sizeRatio: Point;

  public get canvasMouseDown$(): Observable<MouseEvent> {
    return this._canvasMouseDown$;
  }

  public get canvasMouseMove$(): Observable<MouseEvent> {
    return this._canvasMouseMove$;
  }

  public get canvasMouseUp$(): Observable<MouseEvent> {
    return this._canvasMouseUp$;
  }

  public get canvasMouseOut$(): Observable<MouseEvent> {
    return this._canvasMouseOut$;
  }

  public get windowResize$(): Observable<MouseEvent> {
    return this._windowResize$;
  }

  public get canvasMouseWheel$(): Observable<WheelEvent> {
    return this._canvasMouseWheel$;
  }

  constructor(canvas: HTMLCanvasElement, renderer: Renderer2) {
    if (!canvas) {
      throw new Error('No provide context!');
    }
    this._renderer = renderer;
    this.canvas = canvas;

    this._init();
  }

  private _init(): void {
    this._canvasMouseDown$ = fromEvent<MouseEvent>(this.canvas, 'mousedown').pipe(takeUntil(this._unsubscribe$));
    this._canvasMouseMove$ = fromEvent<MouseEvent>(this.canvas, 'mousemove').pipe(takeUntil(this._unsubscribe$));
    this._canvasMouseUp$ = fromEvent<MouseEvent>(this.canvas, 'mouseup').pipe(takeUntil(this._unsubscribe$));
    this._canvasMouseOut$ = fromEvent<MouseEvent>(this.canvas, 'mouseout').pipe(takeUntil(this._unsubscribe$));
    this._canvasMouseWheel$ = fromEvent<WheelEvent>(this.canvas, 'wheel').pipe(takeUntil(this._unsubscribe$));
    this._windowResize$ = fromEvent<MouseEvent>(window, 'resize').pipe(takeUntil(this._unsubscribe$));

    this.setCanvasSize();

    this.context2D = this.canvas.getContext('2d');
  }

  /**
   * Sets HTML canvas sizes. Set the dimensions of the parent div for the canvas
   */
  setCanvasSize(): void {
    this._size.width = this.canvas.width = this.canvas.parentElement?.clientWidth || 0;
    this._size.height = this.canvas.height = this.canvas.parentElement?.clientHeight || 0;
    this.rect = this.canvas.getBoundingClientRect();
    this.sizeRatio = { x: this._size.width / this.rect.width, y: this._size.height / this.rect.height };
  }

  /**
   * Returns the current HTML canvas size.
   * @returns {DOMPoint} Weight and height.
   */

  getCanvasSize(): { w: number, h: number } {
    return {
      w: this.canvas.width, h: this.canvas.height
    }
  }

  /**
   * Converts HTML canvas coordinates (such as cursor position) to coordinates
   * matrix canvas (https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/).
   * @param {number} x - coordinate х.
   * @param {number} y - coordinate y.
   * @returns {DOMPoint} Transformed coordinates.
   */

  getTransformedPoint(x: number, y: number): DOMPoint {
    const originalPoint = new DOMPoint(x * this.sizeRatio.x, y * this.sizeRatio.y);
    return this.context2D!.getTransform().invertSelf().transformPoint(originalPoint)
  }

  destroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}