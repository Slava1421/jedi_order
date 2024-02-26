import { Figure } from "./draw-field";

export class ParkingManagerToolbar {
  private _drawingFigure: string

  
  public get drawingFigure() : string {
    return this._drawingFigure;
  }

  
  public set drawingFigure(v : string) {
    this._drawingFigure = v;
  }
  
  
}