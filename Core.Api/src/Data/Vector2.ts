export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  x: number;
  y: number;

  Equals(value: Vector2): boolean {
    if (value.x !== this.x || value.y !== this.y) return false;
    return true;
  }
}
