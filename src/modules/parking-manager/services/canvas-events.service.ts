import { Injectable } from '@angular/core';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { CanvasInstance } from '../shared/canvas-instance';
import { ParkingManagerToolbar } from '../shared/parking-manager-toolbar';
import { Rectangle } from '../shared/draw-objects/rectangle';
import { Circle } from '../shared/draw-objects/circle';
import { DrawParkingField } from '../shared/draw-field';
import { Point } from '../models/parking-manager.model';

@Injectable()
export class CanvasEventsService {

  private _domMatrixState: DOMMatrix | undefined;


  drawFiguresEvent(
    canvasInstance: CanvasInstance,
    toolbar: ParkingManagerToolbar,
    drawField: DrawParkingField,
  ): void {
    canvasInstance.canvasMouseDown$
      .pipe(
        filter(_ => !!toolbar.drawingFigure),
        map((e: MouseEvent) => {
          const { x, y } = canvasInstance.getTransformedPoint(e.offsetX, e.offsetY);

          const figureInstance = toolbar.getFigureInstance();
          figureInstance!.lineWidth = toolbar.lineWidth;

          // треба доробити з міксінами
          if (figureInstance instanceof Rectangle || figureInstance instanceof Circle) {
            figureInstance!.setFillСolor(toolbar.fillColor || '');
          }

          return {
            figureInstance,
            start: { x, y },
          }
        }),
        switchMap((ev) => {
          return canvasInstance.canvasMouseMove$
            .pipe(
              map(m => {
                const { x, y } = canvasInstance.getTransformedPoint(m.offsetX, m.offsetY);
                return {
                  ...ev,
                  end: { x, y }
                }
              }),
              takeUntil(canvasInstance.canvasMouseUp$.pipe(
                tap(_ => {
                  if (ev.figureInstance && ev.figureInstance.sizeVerification()) {
                    drawField.saveFigure(ev.figureInstance);
                  }
                })
              )),
              takeUntil(canvasInstance.canvasMouseOut$.pipe(
                tap(_ => {
                  if (ev.figureInstance && ev.figureInstance.sizeVerification()) {
                    drawField.saveFigure(ev.figureInstance);
                  }
                })
              )),
            )
        })
      )
      .subscribe({
        next: (opt) => {
          if (opt.figureInstance) {

            let { start, end } = opt;

            // прив'язуємо до сітки малювання фігур
            if (toolbar.snapToGrid) {
              start = drawField.grid.snapToGrid(start);
              end = drawField.grid.snapToGrid(end);
            }

            opt.figureInstance.setParams(start, end);
            drawField.redraw();
            drawField.draw(opt.figureInstance);
          }
        }
      });
  }

  highlightFigureEvent(
    canvasInstance: CanvasInstance,
    drawField: DrawParkingField,
  ): void {
    canvasInstance.canvasMouseDown$
      .pipe(
        map((m => {
          const { x, y } = canvasInstance.getTransformedPoint(m.offsetX, m.offsetY);
          const cursorPosition = { x, y };
          return cursorPosition
        }))
      )
      .subscribe({
        next: (cursorPosition: Point) => {
          drawField.highlightFigureOnHover(cursorPosition);
          drawField.redraw();
        }
      })
  }

  scaleField(
    canvasInstance: CanvasInstance,
    drawField: DrawParkingField,
  ): void {
    canvasInstance.canvasMouseWheel$
      .subscribe({
        next: (ev: WheelEvent) => {
          const { x: mousex, y: mousey } = canvasInstance.getTransformedPoint(ev.offsetX, ev.offsetY);
          const direction = ev.deltaY > 0 ? -1 : 1;
          // Коэффициент масштабирования
          const scaleFactor = 1 + 0.1 * direction; // Например, увеличение/уменьшение на 10%
          drawField.scale(mousex, mousey, scaleFactor);

          // Встановлення параметрів для сітки після зміни масштабу
          const transformedCoord = canvasInstance.getTransformedPoint(0, 0);
          const transformedSize = canvasInstance.getTransformedPoint(canvasInstance.getCanvasSize().w, canvasInstance.getCanvasSize().h);
          drawField.grid.canvasH = transformedSize.y;
          drawField.grid.canvasW = transformedSize.x;
          drawField.grid.startX = transformedCoord.x;
          drawField.grid.startY = transformedCoord.y;
          //----------

          drawField.redraw();

          this._domMatrixState = canvasInstance.context2D?.getTransform();
        }
      })
  }

  windowResize(
    canvasInstance: CanvasInstance,
    drawField: DrawParkingField,
  ): void {
    canvasInstance.windowResize$.subscribe({
      next: (e: MouseEvent) => {
        console.log('resizeaa');

        canvasInstance.setCanvasSize();

        try {
          canvasInstance.context2D?.setTransform(
            this._domMatrixState!.a,
            this._domMatrixState!.b,
            this._domMatrixState!.c,
            this._domMatrixState!.d,
            this._domMatrixState!.e,
            this._domMatrixState!.f
          );
        } catch (e) {
          console.error(e);
        }
        drawField.redraw();
      }
    });
  }
}
