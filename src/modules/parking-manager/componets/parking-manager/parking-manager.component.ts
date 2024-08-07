import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { DrawParkingField } from '../../shared/draw-field';
import { CanvasInstance } from '../../shared/canvas-instance';
import { FiguresTypes, Point } from '../../models/parking-manager.model';
import { ParkingManagerToolbar } from '../../shared/parking-manager-toolbar';
import { CanvasEventsService } from '../../services/canvas-events.service';
import { Grid } from '../../shared/draw-objects/grid';

@Component({
  selector: 'app-parking-manager',
  templateUrl: './parking-manager.component.html',
  styleUrl: './parking-manager.component.scss',
  providers: [CanvasEventsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParkingManagerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas') canvRef: ElementRef;

  private _canvas: HTMLCanvasElement;
  private _drawField: DrawParkingField;
  private _canvasInstance: CanvasInstance;
  private _toolbar: ParkingManagerToolbar = new ParkingManagerToolbar();


// для дебага
  posCursorCanvas = { x: 0, y: 0, scale: { x: 0, y: 0 }, w: 0, h: 0, rect: null };

  constructor(
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
    private _cEvents: CanvasEventsService,
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
    this._drawGrid();
  }

  testLineWidth(e: any): void {
    this._toolbar.lineWidth = Number(e.target.value);
  }

  testSnapToGrid(checked: boolean): void {
    console.log(checked);
    this._toolbar.snapToGrid = checked;
  }

  testColor(e: any): void {
    this._toolbar.fillColor = String(e.target.value);
  }

  onStartDraw(figureType: string): void {
    this._toolbar.drawingFigure = figureType as FiguresTypes;
  }

  private _listenMouseEvents(): void {
    this._cEvents.drawFiguresEvent(this._canvasInstance, this._toolbar, this._drawField);
    this._cEvents.highlightFigureEvent(this._canvasInstance, this._drawField);
    this._cEvents.scaleField(this._canvasInstance, this._drawField);
    this._cEvents.windowResize(this._canvasInstance, this._drawField);
  }

  private _drawGrid(): void {
    if (!this._canvasInstance.context2D) {
      throw new Error('Draw error, provide context!');
    }
    const grid = new Grid(20);
    grid.canvasH = this._canvasInstance.getCanvasSize().h
    grid.canvasW = this._canvasInstance.getCanvasSize().w
    grid.draw(this._canvasInstance.context2D);
    this._drawField.grid = grid;
  }

  ngOnDestroy(): void {
    this._canvasInstance.destroy();
  }
}
