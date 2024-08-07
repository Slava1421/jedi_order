import { Point } from '../models/parking-manager.model';
import { CanvasInstance } from './canvas-instance';
import { FigureBase } from './draw-objects/figure-base';
import { Grid } from './draw-objects/grid';

/**
 * Клас описує поле малювання основної сцени на канвасі.
 */

export class DrawParkingField {

  // private _figures: Figure[] = [];
  private _figures = new Map<string, FigureBase>();
  
  public grid: Grid;
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
   * @returns {FigureBase[]} Массив фігур.
   */
  getState(): Map<string, FigureBase> {
    return this._figures;
  }

  /**
   * Функція, яка малює одну фігуру в контексті канваса, який створений в конструкторі DrawParkingField.
   * @param { FigureBase } drawObject - Об'єкт фігури.
   */
  draw(drawObject: FigureBase): void {
    if (!this.ctx) {
      return;
    }

    drawObject.draw(this.ctx);
  }

  /**
   * Підсвітка фігури, якщо передані координати попадають в межі фігури
   * яка зараз намальована на канвасі
   * @param {Point} cursorPosition - координати.
   * @returns {FigureBase | undefined} Фігура, в яку потрапили координати.
   */
  highlightFigureOnHover(cursorPosition: Point, highlightСolor?: string): void {
    if (!this.ctx) {
      return;
    }

    for (const value of this._figures.values()) {
      if (value instanceof FigureBase) {
        const isHover = value.isHoverCursor(cursorPosition);

        if (isHover) {
          value.setLineColor(highlightСolor || 'red');
        } else {
          value.setLineColor();
        }
      }
    }
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

  saveFigure(figure: FigureBase): void {
    figure.zIndex = this._figures.size;
    this._figures.set(figure.id, figure);
    console.log(this._figures);
  }

  /**
   * Ця функція перемалювує всі фігури на canvas. 
   * Функція видаляє попередні малюнки на холсті і замінює їх новими, які знаходяться у списку фігур
   */
  redraw(): void {
    // Очищує холст, видаляючи всі попередні малюнки або фігури
    this.clear();

    // перемальовуємо сітку
    if (this.grid && this.ctx) {
      this.grid.draw(this.ctx);
    }

    for (const value of this._figures.values()) {
      this.draw(value);
    }
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
