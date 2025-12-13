export class Vector2 {
  constructor(x = 0, y = 0) {
    this.X = x;
    this.Y = y;
  }

  X: number;
  Y: number;

  Equals(value: Vector2): boolean {
    return !(value.X !== this.X || value.Y !== this.Y);
  }
}
