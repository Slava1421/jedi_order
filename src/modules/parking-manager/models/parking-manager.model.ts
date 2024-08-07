export interface Point {
  x: number;
  y: number;
}

export interface FigureParams {
  x: number;
  y: number;

  lineWidth: number;
}
export interface RectangleParams extends FigureParams {
  height: number;
  width: number;
}
export interface LineParams extends FigureParams {
  xEnd: number;
  yEnd: number;
}
export interface CircleParams extends FigureParams {
  radius: number;
}

export enum FiguresTypes {
  Circle = 'circle',
  Rectangle = 'rectangle',
  Line = 'line',
}