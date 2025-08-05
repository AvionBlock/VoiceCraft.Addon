export class Z85 {
  static #Base85 = 85;

  static #EncodingTable = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    ".",
    "-",
    ":",
    "+",
    "=",
    "^",
    "!",
    "/",
    "*",
    "?",
    "&",
    "<",
    ">",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "@",
    "%",
    "$",
    "#",
  ];

  static #DecodingTable = [
    0, 68, 0, 84, 83, 82, 72, 0, 75, 76, 70, 65, 0, 63, 62, 69, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 64, 0, 73, 66, 74, 71, 81, 36, 37, 38, 39, 40, 41, 42, 43,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 77,
    0, 78, 67, 0, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 79, 0, 80, 0, 0,
  ];

  /**
   * @param { Uint8Array } data
   * @returns { String }
   */
  static getStringWithPadding(data) {
    const lengthMod4 = data.length % 4;
    const paddingRequired = lengthMod4 != 0;
    let bytesToEncode = data;
    let bytesToPad = 0;
    if (paddingRequired) {
      bytesToPad = 4 - lengthMod4;
      bytesToEncode = new Uint8Array(data.length + bytesToPad);
      bytesToEncode.set(data);
    }

    let z85String = this.getString(bytesToEncode);
    if (paddingRequired) {
      z85String += bytesToPad;
    }

    return z85String;
  }

  /**
   * @param { Uint8Array } data
   * @returns { String }
   */
  static getString(data) {
    if (data.length % 4 != 0) {
      throw new RangeError("Input length must be a multiple of 4.");
    }

    const view = new DataView(data.buffer);
    let result = "";
    let value = 0;

    for (let i = 0; i < data.length; ++i) {
      value = value * 256 + view.getUint8(i);
      if ((i + 1) % 4 === 0) {
        let divisor = this.#Base85 * this.#Base85 * this.#Base85 * this.#Base85;
        for (let j = 5; j > 0; --j) {
          const code = Math.floor(value / divisor) % this.#Base85;
          result += this.#EncodingTable[code];
          divisor /= this.#Base85;
        }
        value = 0;
      }
    }
    return result;
  }

  /**
   * @param { String } data
   * @returns { Uint8Array }
   */
  static getBytesWithPadding(data) {
    var lengthMod5 = data.length % 5;
    if (lengthMod5 != 0 && (data.length - 1) % 5 != 0) {
      throw new RangeError(
        "Input length must be a multiple of 5 with either padding or no padding."
      );
    }

    let paddedBytes = 0;
    if (lengthMod5 != 0) {
      paddedBytes = Number.parseInt(data.charAt(data.length - 1));
      if (isNaN(paddedBytes) || paddedBytes < 1 || paddedBytes > 3) {
        throw new Error("Invalid padding character for a Z85 string.");
      }

      data = data.substring(0, data.length - 1);
    }

    let output = this.getBytes(data);
    //Remove padded bytes
    if (paddedBytes > 0) output = output.slice(0, output.length - paddedBytes);
    return output;
  }

  /**
   * @param { String } data
   * @returns { Uint8Array }
   */
  static getBytes(data) {
    if (data.length % 5 != 0) {
      throw new RangeError("Input length must be a multiple of 5");
    }

    const output = new Uint8Array((data.length / 5) * 4);
    const view = new DataView(output.buffer);
    let value = 0;
    let charIdx = 0;
    let byteIdx = 0;
    for (var i = 0; i < data.length; ++i) {
      const code = data.charCodeAt(charIdx++) - 32;
      value = value * this.#Base85 + this.#DecodingTable[code];
      if (charIdx % 5 === 0) {
        let divisor = 256 * 256 * 256;
        while (divisor >= 1) {
          if (byteIdx < view.byteLength) {
            view.setUint8(byteIdx++, Math.floor(value / divisor) % 256);
          }
          divisor /= 256;
        }
        value = 0;
      }
    }

    return output;
  }
}
