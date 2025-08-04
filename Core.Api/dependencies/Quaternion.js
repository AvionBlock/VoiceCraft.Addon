export class Quaternion {
  /**
   * @param { Number } x
   * @param { Number } y
   * @param { Number } z
   * @param { Number } w
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /** @type { Number } */
  x;
  /** @type { Number } */
  y;
  /** @type { Number } */
  z;
  /** @type { Number } */
  w;

  /**
   * @param { Quaternion } value
   * @returns { Boolean }
   */
  equals(value) {
    if (!(value instanceof Quaternion)) return false;
    if (
      value.x !== this.x ||
      value.y !== this.y ||
      value.z !== this.z ||
      value.w !== this.w
    )
      return false;
    return true;
  }
}