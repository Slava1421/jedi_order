import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Circle, DrawParkingField, Figure, Line, Rectangle } from '../../shared/draw-field';
import { CanvasInstance } from '../../shared/canvas-instance';
import { Point } from '../../models/parking-manager.model';
import { debounceTime, filter, map, pairwise, switchMap, takeUntil, tap } from 'rxjs';
import { ParkingManagerToolbar } from '../../shared/parking-manager-toolbar';

@Component({
  selector: 'app-parking-manager',
  templateUrl: './parking-manager.component.html',
  styleUrl: './parking-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParkingManagerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvRef: ElementRef;

  private _canvas: HTMLCanvasElement;
  private _drawField: DrawParkingField;
  private _canvasInstance: CanvasInstance;
  private _toolbar: ParkingManagerToolbar = new ParkingManagerToolbar();

  posCursorCanvas = { x: 0, y: 0, scale: { x: 0, y: 0 }, rect: null };

  testLineWidth: number;

  constructor(private _renderer: Renderer2, private _cd: ChangeDetectorRef) { }

  test(e: any): void {
    console.log(e.target.value);
    this.testLineWidth = Number(e.target.value);
  }

  onStartDraw(figureType: string): void {
    this._toolbar.drawingFigure = figureType;
  }

  getFigureInstance(figureType: string): Figure | null {
    switch (figureType) {
      case 'rectangle':
        return new Rectangle();

      case 'line':
        return new Line();

      case 'circle':
        return new Circle();

      default:
        return null;
    }
  }

  ngAfterViewInit(): void {
    this._canvas = (this.canvRef.nativeElement as HTMLCanvasElement);

    this._canvasInstance = new CanvasInstance(this._canvas, this._renderer);
    this._drawField = new DrawParkingField(this._canvasInstance);
    /////////////////////////////////////////
    this._canvasInstance.canvasMouseMove$.subscribe({
      next: (e: MouseEvent) => {

        const rect = this._canvasInstance.rect;
        const scale: Point = this._canvasInstance.scale;

        const originalPoint = new DOMPoint(e.offsetX, e.offsetY);
        const s = this._canvasInstance.context2D!.getTransform().invertSelf().transformPoint(originalPoint)
        this.posCursorCanvas = {
          x: (e.clientX - rect.left) * scale.x,
          y: (e.clientY - rect.top) * scale.y,
          scale: { x: scale.x, y: scale.y },
          rect: s as any
        };
        this._cd.detectChanges()
      }
    })
    //////////////////////////////////////

    this._listenMouseEvents();
  }

  private _listenMouseEvents(): void {


    this._mouseDownAndMove();
    this._mouseClick();
    this._mouseWheel();
  }

  private _mouseDownAndMove(): void {
    this._canvasInstance.canvasMouseDown$
      .pipe(
        filter(f => !!this._toolbar.drawingFigure),
        map((e: MouseEvent) => {
          const rect = this._canvasInstance.rect;
          const scale: Point = this._canvasInstance.scale;

          const figureInstance = this.getFigureInstance(this._toolbar.drawingFigure)
          figureInstance!.lineWidth = this.testLineWidth;
          return {
            figureInstance,
            start: {
              // x: (e.clientX - rect.left) * scale.x,
              // y: (e.clientY - rect.top) * scale.y
              x: this.getTransformedPoint(e.offsetX, e.offsetY).x,
              y: this.getTransformedPoint(e.offsetX, e.offsetY).y
            },
            options: { lineWidth: this.testLineWidth },
            rect,
            scale
          }
        }),
        switchMap((ev) => {
          return this._canvasInstance.canvasMouseMove$
            .pipe(
              map((m => ({
                ...ev,
                end: {
                  // x: (m.clientX - ev.rect.left) * ev.scale.x,
                  // y: (m.clientY - ev.rect.top) * ev.scale.y
                  x: this.getTransformedPoint(m.offsetX, m.offsetY).x,
                  y: this.getTransformedPoint(m.offsetX, m.offsetY).y
                }
              }))),
              takeUntil(this._canvasInstance.canvasMouseUp$.pipe(
                tap(_ => {
                  if (ev.figureInstance && ev.figureInstance.sizeVerification()) {
                    this._drawField.saveFigure(ev.figureInstance);
                  }
                })
              )),
              takeUntil(this._canvasInstance.canvasMouseOut$.pipe(
                tap(_ => {
                  if (ev.figureInstance && ev.figureInstance.sizeVerification()) {
                    this._drawField.saveFigure(ev.figureInstance);
                  }
                })
              )),
            )
        })
      )
      .subscribe({
        next: (opt) => {
          if (opt.figureInstance) {
            opt.figureInstance.setParams(opt.start, opt.end);
            this._drawField.redraw();
            this._drawField.draw(opt.figureInstance);
          }
        }
      });
  }

  private _mouseClick(): void {
    this._canvasInstance.canvasMouseDown$
      .pipe(
        map((m => {
          const rect = this._canvasInstance.rect;
          const scale: Point = this._canvasInstance.scale;
          const cursorPosition = {
            // x: (m.clientX - rect.left) * scale.x,
            // y: (m.clientY - rect.top) * scale.y
            x: this.getTransformedPoint(m.offsetX, m.offsetY).x,
            y: this.getTransformedPoint(m.offsetX, m.offsetY).y
          };
          return cursorPosition
        }))
      )
      .subscribe({
        next: (cursorPosition: Point) => {
          this._drawField.highlightFigureOnHover(cursorPosition)
          this._drawField.redraw();
        }
      })
  }

  private _mouseWheel(): void {
    this._canvasInstance.canvasMouseWheel$
      .pipe(
      // map((m => {
      //   const cursorPosition = {
      //     x: (m.clientX - rect.left) * scale.x,
      //     y: (m.clientY - rect.top) * scale.y
      //   };
      //   return !!this._drawField.highlightFigureOnHover(cursorPosition)
      // })),
      // pairwise(),
    )
      .subscribe({
        next: (ev: WheelEvent) => {
          const mousex = this.getTransformedPoint(ev.offsetX, ev.offsetY).x;
          const mousey = this.getTransformedPoint(ev.offsetX, ev.offsetY).y;

          // const mousex = Math.round(ev.clientX - this._canvasInstance.rect.left);
          // const mousey = Math.round(ev.clientY - this._canvasInstance.rect.top);

          // console.log('wheel', mousex, mousey);


          const deltaY = ev.deltaY;

          // Определение направления масштабирования (увеличение или уменьшение)
          const direction = deltaY > 0 ? -1 : 1;

          // Коэффициент масштабирования
          const scaleFactor = 1 + 0.1 * direction; // Например, увеличение/уменьшение на 10%

          // Применение масштабирования к контексту холста
          this._canvasInstance.context2D!.translate(mousex, mousey);
          this._canvasInstance.context2D!.scale(scaleFactor, scaleFactor);
          this._canvasInstance.context2D!.translate(-mousex, -mousey);

          this._drawField.redraw();
        }
      })
  }

  getTransformedPoint(x: number, y: number): DOMPoint {
    const originalPoint = new DOMPoint(x, y);
    return this._canvasInstance.context2D!.getTransform().invertSelf().transformPoint(originalPoint)
  }

  ngOnDestroy(): void {
    this._canvasInstance.destroy();
  }
}
