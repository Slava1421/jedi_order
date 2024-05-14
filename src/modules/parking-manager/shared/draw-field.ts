import { CircleParams, LineParams, Point, RectangleParams } from "../models/parking-manager.model";
import { CanvasInstance } from "./canvas-instance";

/**
 * Клас описує поле малювання основної сцени на канвасі.
 */

export class DrawParkingField {

  private _figures: Figure[] = [];
  public canvas: CanvasInstance;
  public ctx: CanvasRenderingContext2D | null;
  // public scaleFactor: Point = { x: 1, y: 1 };

  constructor(canvasInstance: CanvasInstance) {

    if (!canvasInstance) {
      throw new Error(`Isn't set canvas`);
    }

    this.canvas = canvasInstance;
    this.ctx = canvasInstance.context2D;
  }

  /**
   * Повертає массив фігур, об'єктів, які зараз є намальовані на канвасі.
   * @returns {Figure[]} Массив фігур.
   */
  getState(): Figure[] {
    return this._figures;
  }

  /**
   * Функція, яка малює одну фігуру в контексті канваса, який створений в конструкторі DrawParkingField.
   * @param {Figure} figure - Об'єкт фігури.
   */
  draw(figure: Figure): void {
    if (!this.ctx) {
      return;
    }

    figure.draw(this.ctx);
  }

  /**
   * Підсвітка фігури, якщо передані координати попадають в межі фігури
   * яка зараз намальована на канвасі
   * @param {Point} cursorPosition - координати.
   * @returns {Figure | undefined} Фігура, в яку потрапили координати.
   */
  highlightFigureOnHover(cursorPosition: Point): Figure | undefined {
    if (!this.ctx) {
      return undefined;
    }

    let result = undefined;

    for (let i = 0; i < this._figures.length; i++) {
      const isHover = this._figures[i].isHoverCursor(cursorPosition);

      if (isHover) {
        result = this._figures[i];
      }
    }

    return result;
  }

  /**
   * Функція масштабує зображення навколо певної точки (x, y) на canvas. 
   * Функція також оновлює деякі параметри масштабування та позиції
   * @param {Point} cursorPosition - координати.
   */
  scale(x: number, y: number, newScaleFactor: number): void {
    // Здійснює зсув початку координат холста до точки (x, y).
    this.ctx!.translate(x, y);
    // Масштабує координатну систему холста на newScaleFactor в обидва боки (по x та y).
    this.ctx!.scale(newScaleFactor, newScaleFactor);
    // Повертає початок координат назад до початкового положення до масштабування.
    this.ctx!.translate(-x, -y);
  }

  saveFigure(figure: Figure): void {
    this._figures.push(figure);
    console.log(this._figures);
  }

  /**
   * Ця функція перемалювує всі фігури на canvas. 
   * Функція видаляє попередні малюнки на холсті і замінює їх новими, які знаходяться у списку фігур
   */
  redraw(): void {
    // Очищує холст, видаляючи всі попередні малюнки або фігури
    this.clear();
    this._figures.forEach((item: Figure) => {
      this.draw(item);
    });
  }

  /**
  * Ця функція виконує очищення  canvas. 
  * Функція видаляє попередні малюнки на canvas і замінює їх новими, які знаходяться у списку фігур
  * Видаляються всі попередні малюнки або фігури з canvas, зберігаючи при цьому розміри canvas та 
  * будь-які інші налаштування контексту малювання
  */
  clear(): void {
    const { w, h } = this.canvas.getCanvasSize();
    // Зберігає поточний стан контексту малювання холста (такі як колір, товщину ліній, трансформації, тощо),
    // щоб можна було повернутися до нього пізніше
    this.ctx?.save();
    // Встановлює одиничну трансформацію, тобто скидає будь-які трансформації, що можуть бути застосовані до холста
    this.ctx?.setTransform(1, 0, 0, 1, 0, 0);
    // Очищує прямокутну область на холсті, починаючи з координат (0, 0) із шириною w та висотою h.
    this.ctx?.clearRect(0, 0, w, h);
    // Відновлює попередній стан контексту малювання холста, який був збережений раніше
    this.ctx?.restore();


    // У випадку функції clear() використання save() та restore() може бути зайвим, 
    // оскільки ми очищаємо весь контекст малювання і не вносимо ніяких змін до його 
    // стану після очищення. Тому в деяких випадках можна було б виключити використання 
    // цих методів без втрати функціональності. Однак їх використання може бути залишено як
    // стандартна практика для забезпечення чистоти коду та уникнення непередбачуваних станів 
    // контексту малювання у більш складних сценаріях.
  }
}

export type FigureInstance = LineParams | RectangleParams | CircleParams;

export abstract class Figure {
  x: number;
  y: number;

  bgColor: string = 'black';
  lineWidth: number;
  ctx: CanvasRenderingContext2D | null;

  constructor() { }

  abstract draw(ctx?: CanvasRenderingContext2D | null): void;
  abstract setParams(start: Point, end: Point): void;
  abstract isHoverCursor(cursorPosition: Point): boolean;
  abstract sizeVerification(): boolean;

  protected visualizeShapeSelection(color: string): void {
    this.bgColor = color;
  }
}

export class Rectangle extends Figure {
  height: number;
  width: number;
  constructor(ctx: CanvasRenderingContext2D | null = null) {
    super();

    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.width = 0;
    this.lineWidth = 1;
    this.ctx = ctx;
  }

  override setParams(start: Point, end: Point): void {
    const height = end.y - start.y;
    const width = end.x - start.x;
    this.height = Math.abs(height);
    this.width = Math.abs(width);
    // The height and width values can be negative, so we adjust the coordinates
    this.x = width < 0 ? start.x + width : start.x;
    this.y = height < 0 ? start.y + height : start.y;
  }

  override draw(ctx?: CanvasRenderingContext2D | null): void {
    if (!ctx && !this.ctx) {
      throw new Error('Draw error, provide context!');
    }
    const context = (ctx || this.ctx);
    // this._ctx.setLineDash([5, 2]);// пунктир
    context!.strokeStyle = this.bgColor;
    context!.lineWidth = this.lineWidth;
    context!.beginPath();
    context!.strokeRect(this.x, this.y, this.width, this.height);
    context!.stroke();
  }

  override isHoverCursor(cursorPosition: Point): boolean {
    if (cursorPosition.x >= this.x && cursorPosition.x <= this.x + this.width &&
      cursorPosition.y >= this.y && cursorPosition.y <= this.y + this.height) {
      this.visualizeShapeSelection('red');
      return true;
    }
    this.visualizeShapeSelection('black');
    return false;
  }

  override sizeVerification(): boolean {
    return !(this.x === 0 && this.y === 0 && this.height === 0 && this.width === 0);
  }
}

export class Line extends Figure {
  xEnd: number;
  yEnd: number;
  constructor() {
    super();

    this.x = 0;
    this.y = 0;

    this.xEnd = 0;
    this.yEnd = 0;

    this.lineWidth = 1;
  }

  override setParams(start: Point, end: Point): void {
    this.x = start.x;
    this.y = start.y;
    this.xEnd = end.x;
    this.yEnd = end.y;
  }

  override draw(ctx?: CanvasRenderingContext2D): void {
    if (!ctx && !this.ctx) {
      throw new Error('Draw error, provide context!');
    }
    const context = (ctx || this.ctx);
    context!.strokeStyle = this.bgColor;
    context!.lineWidth = this.lineWidth;
    context!.beginPath();
    context!.moveTo(this.x, this.y);
    context!.lineTo(this.xEnd, this.yEnd);
    context!.stroke();
  }

  override isHoverCursor(cursorPosition: Point): boolean {
    return false;
  }

  override sizeVerification(): boolean {
    return !(this.x === 0 && this.y === 0 && this.xEnd === 0 && this.yEnd === 0);
  }
}

export class Circle extends Figure {
  radius: number;
  constructor() {
    super();

    this.x = 0;
    this.y = 0;

    this.radius = 0;

    this.lineWidth = 1;
  }

  override setParams(start: Point, end: Point): void {

    this.x = (start.x + end.x) / 2;
    this.y = (start.y + end.y) / 2;
    this.radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) / 2;
  }

  override draw(ctx?: CanvasRenderingContext2D): void {
    if (!ctx && !this.ctx) {
      throw new Error('Draw error, provide context!');
    }
    const context = (ctx || this.ctx);
    context!.strokeStyle = this.bgColor;
    context!.lineWidth = this.lineWidth;
    context!.beginPath();
    context!.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context!.stroke();
  }

  override isHoverCursor(cursorPosition: Point): boolean {
    return false;
  }

  override sizeVerification(): boolean {
    return !(this.x === 0 && this.y === 0 && this.radius === 0);
  }
}