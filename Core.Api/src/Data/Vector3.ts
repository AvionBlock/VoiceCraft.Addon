export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  x: number;
  y: number;
  z: number;

  Equals(value: Vector3): boolean {
    if (value.x !== this.x || value.y !== this.y || value.z !== this.z)
      return false;
    return true;
  }
}
