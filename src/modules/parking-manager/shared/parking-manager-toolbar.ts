import { FiguresTypes } from "../models/parking-manager.model";
import { Circle } from "./draw-objects/circle";
import { FigureBase } from "./draw-objects/figure-base";
import { Line } from "./draw-objects/line";
import { Rectangle } from "./draw-objects/rectangle";


export class ParkingManagerToolbar {
  public drawingFigure: FiguresTypes;
  public lineWidth: number;
  public fillColor: string;
  public snapToGrid: boolean;
  
  getFigureInstance(): FigureBase | null {

    if (!this.drawingFigure) {
      throw new Error('Need a figure to draw');      
    }

    switch (this.drawingFigure) {
      case FiguresTypes.Rectangle:
        return new Rectangle();

      case FiguresTypes.Line:
        return new Line();

      case FiguresTypes.Circle:
        return new Circle();

      default:
        return null;
    }
  }
}