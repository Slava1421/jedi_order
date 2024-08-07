import { generateUUID } from "../../../../core/helpers/tools";
import { Point } from "../../models/parking-manager.model";

export class Grid {
  private _gridSpacing = 0;
  private _ctx: CanvasRenderingContext2D | null;
  private _prefix = 'grid';

  public id: string;
  public startX = 0;
  public startY = 0;
  public canvasW: number;
  public canvasH: number;
  public zIndex: number = -1;

  constructor(gridSpacing: number, ctx: CanvasRenderingContext2D | null = null,) {
    this._ctx = ctx;
    this._gridSpacing = gridSpacing;

    this.id = `${this._prefix}_${generateUUID()}`;
  }


  draw(
    ctx: CanvasRenderingContext2D,
  ) {

    if (!ctx && !this._ctx) {
      throw new Error('Draw error, provide context!');
    }
    const context = (ctx || this._ctx);

    context.fillStyle = 'black';

    // поки алгоритм такий, але треба зробити більш оптимально і читабельно
    // прорисовка точок повинна починатись з координат [0,0], щоб уже намальовані ою'єкти не з'їжджали,
    // але при зміні масштабу можуть бути від'ємні координати які треба врахувати 

    for (let y = 0; y < this.canvasH; y += this._gridSpacing) {
      for (let x = 0; x < this.canvasW; x += this._gridSpacing) {
        context.fillRect(x, y, 1, 1); // рисуем точку размером 1x1 пиксель
      }

      for (let x = -this._gridSpacing + 1; x > this.startX; x -= this._gridSpacing) {
        context.fillRect(x, y, 1, 1); // рисуем точку размером 1x1 пиксель
      }
    }

    for (let y = -this._gridSpacing + 1; y > this.startY; y -= this._gridSpacing) {
      for (let x = 0; x < this.canvasW; x += this._gridSpacing) {
        context.fillRect(x, y, 1, 1); // рисуем точку размером 1x1 пиксель
      }

      for (let x = -this._gridSpacing + 1; x > this.startX; x -= this._gridSpacing) {
        context.fillRect(x, y, 1, 1); // рисуем точку размером 1x1 пиксель
      }
    }


  }

  snapToGrid(point: Point): Point {

    const snap = (value: number) => Math.round(value / this._gridSpacing) * this._gridSpacing;

    return {
      x: snap(point.x),
      y: snap(point.y)
    };
  }
}