export class Vector2 {
  /**
   * @param { Number } x
   * @param { Number } y
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** @type { Number } */
  x;
  /** @type { Number } */
  y;

  /**
   * @param { Vector2 } value
   * @returns { Boolean }
   */
  equals(value) {
    if (!(value instanceof Vector2)) return false;
    if (
      value.x !== this.x ||
      value.y !== this.y
    )
      return false;
    return true;
  }
}