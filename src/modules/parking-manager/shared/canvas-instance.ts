import { Observable, Subject, fromEvent, takeUntil } from "rxjs";
import { Point } from "../models/parking-manager.model";
import { Renderer2 } from "@angular/core";

const WIDTH = 600;
const HEIGHT = 300;
const PADDING = 40
const DPI_WIDTH = WIDTH //* 2;
const DPI_HEIGHT = HEIGHT //* 2;
const VIEW_HEIGHT = DPI_HEIGHT;// - PADDING * 2
const VIEW_WIDTH = DPI_WIDTH

export class CanvasInstance {

  private _canvasMouseDown$: Observable<MouseEvent>;
  private _canvasMouseMove$: Observable<MouseEvent>;
  private _canvasMouseUp$: Observable<MouseEvent>;
  private _canvasMouseOut$: Observable<MouseEvent>;
  private _canvasMouseWheel$: Observable<WheelEvent>;
  private _unsubscribe$ = new Subject();
  private _renderer: Renderer2;

  public canvas: HTMLCanvasElement;
  public context2D: CanvasRenderingContext2D | null;
  public rect: DOMRect;
  public scale: Point;

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

    this.canvas.width = DPI_WIDTH;
    this.canvas.height = DPI_HEIGHT
    this._renderer.setStyle(this.canvas, 'width', `${WIDTH}px`);
    this._renderer.setStyle(this.canvas, 'height', `${HEIGHT}px`);

    this.context2D = this.canvas.getContext('2d');
    this.rect = this.canvas.getBoundingClientRect();
    this.scale = { x: this.canvas.width / this.rect.width, y: this.canvas.height / this.rect.height };
  }

  getSizes(): { w: number, h: number } {
    return {
      w: this.canvas.width, h: this.canvas.height
    }
  }

  destroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}