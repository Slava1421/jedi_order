import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Circle, DrawParkingField, Figure, Line, Rectangle } from '../../shared/draw-field';
import { CanvasInstance } from '../../shared/canvas-instance';
import { Point } from '../../models/parking-manager.model';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs';
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

  posCursorCanvas = { x: 0, y: 0, scale: { x: 0, y: 0 }, w: 0, h: 0, rect: null };

  testLineWidth: number;

  constructor(
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this._canvas = (this.canvRef.nativeElement as HTMLCanvasElement);

    this._canvasInstance = new CanvasInstance(this._canvas, this._renderer);
    this._drawField = new DrawParkingField(this._canvasInstance);
    /////////////////////////////////////////
    this._canvasInstance.canvasMouseMove$.subscribe({
      next: (e: MouseEvent) => {

        const rect = this._canvasInstance.rect;
        const scale: Point = this._canvasInstance.sizeRatio;

        const originalPoint = new DOMPoint(e.offsetX * scale.x, e.offsetY * scale.y);
        const s = this._canvasInstance.context2D!.getTransform().invertSelf().transformPoint(originalPoint)

        this.posCursorCanvas = {
          x: (e.clientX - rect.left) * scale.x,
          y: (e.clientY - rect.top) * scale.y,
          // x: this.getTransformedPoint(e.offsetX, e.offsetY).x ,
          // y: this.getTransformedPoint(e.offsetX, e.offsetY).y ,
          scale: { x: scale.x, y: scale.y },
          w: this._canvas.width,
          h: this._canvas.height,
          rect: s as any
        };
        this._cd.detectChanges()
      }
    })
    //////////////////////////////////////

    this._listenMouseEvents();
  }

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

  private _listenMouseEvents(): void {
    this._drawFiguresEvent();
    this._highlightFigureEvent();
    this._scaleField();
    this._windowResize();
  }

  private _drawFiguresEvent(): void {
    this._canvasInstance.canvasMouseDown$
      .pipe(
        filter(_ => !!this._toolbar.drawingFigure),
        map((e: MouseEvent) => {
          const { x, y } = this._canvasInstance.getTransformedPoint(e.offsetX, e.offsetY);

          const figureInstance = this.getFigureInstance(this._toolbar.drawingFigure);
          figureInstance!.lineWidth = this.testLineWidth;
          return {
            figureInstance,
            start: {
              x,
              y
            },
          }
        }),
        switchMap((ev) => {
          return this._canvasInstance.canvasMouseMove$
            .pipe(
              map(m => {
                const { x, y } = this._canvasInstance.getTransformedPoint(m.offsetX, m.offsetY);
                return {
                  ...ev,
                  end: {
                    x,
                    y
                  }
                }
              }),
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

  private _highlightFigureEvent(): void {
    this._canvasInstance.canvasMouseDown$
      .pipe(
        map((m => {
          const { x, y } = this._canvasInstance.getTransformedPoint(m.offsetX, m.offsetY);
          const cursorPosition = { x, y };
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

  private _scaleField(): void {
    this._canvasInstance.canvasMouseWheel$
      .subscribe({
        next: (ev: WheelEvent) => {
          const { x: mousex, y: mousey } = this._canvasInstance.getTransformedPoint(ev.offsetX, ev.offsetY);
          const direction = ev.deltaY > 0 ? -1 : 1;
          // Коэффициент масштабирования
          const scaleFactor = 1 + 0.1 * direction; // Например, увеличение/уменьшение на 10%
          this._drawField.scale(mousex, mousey, scaleFactor);
          this._drawField.redraw();

          this.ttt = this._canvasInstance.context2D?.getTransform();
        }
      })
  }

  ttt: DOMMatrix | undefined;

  private _windowResize(): void {
    this._canvasInstance.windowResize$.subscribe({
      next: (e: MouseEvent) => {
        console.log('resizeaa');
        
        this._canvasInstance.setCanvasSize();

        try {
          this._canvasInstance.context2D?.setTransform(
            this.ttt!.a,
            this.ttt!.b,
            this.ttt!.c,
            this.ttt!.d,
            this.ttt!.e,
            this.ttt!.f
          );
        } catch (e) {
          console.error(e);
        }
        this._drawField.redraw();
      }
    });
  }

  ngOnDestroy(): void {
    this._canvasInstance.destroy();
  }
}
