export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.X = x;
    this.Y = y;
    this.Z = z;
  }

  X: number;
  Y: number;
  Z: number;

  Equals(value: Vector3): boolean {
    return !(value.X !== this.X || value.Y !== this.Y || value.Z !== this.Z);
  }
}
