export class Z85 {
  private static _base85 = 85;
  private static _encodingTable = [
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

  private static _decodingTable = [
    0, 68, 0, 84, 83, 82, 72, 0, 75, 76, 70, 65, 0, 63, 62, 69, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 64, 0, 73, 66, 74, 71, 81, 36, 37, 38, 39, 40, 41, 42, 43,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 77,
    0, 78, 67, 0, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 79, 0, 80, 0, 0,
  ];

  public static GetStringWithPadding(data: Uint8Array): string {
    const lengthMod4 = data.length % 4;
    const paddingRequired = lengthMod4 != 0;
    let bytesToEncode = data;
    let bytesToPad = 0;
    if (paddingRequired) {
      bytesToPad = 4 - lengthMod4;
      bytesToEncode = new Uint8Array(data.length + bytesToPad);
      bytesToEncode.set(data);
    }

    let z85String = this.GetString(bytesToEncode);
    if (paddingRequired) {
      z85String += bytesToPad;
    }

    return z85String;
  }

  public static GetString(data: Uint8Array): string {
    if (data.length % 4 != 0) {
      throw new RangeError("Input length must be a multiple of 4.");
    }

    const view = new DataView(data.buffer);
    let result = "";
    let value = 0;

    for (let i = 0; i < data.length; ++i) {
      value = value * 256 + view.getUint8(i);
      if ((i + 1) % 4 === 0) {
        let divisor = this._base85 * this._base85 * this._base85 * this._base85;
        for (let j = 5; j > 0; --j) {
          const code = Math.floor(value / divisor) % this._base85;
          result += this._encodingTable[code];
          divisor /= this._base85;
        }
        value = 0;
      }
    }
    return result;
  }

  public static GetBytesWithPadding(data: string): Uint8Array {
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

    let output = this.GetBytes(data);
    //Remove padded bytes
    if (paddedBytes > 0) output = output.slice(0, output.length - paddedBytes);
    return output;
  }

  public static GetBytes(data: string): Uint8Array {
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
      value = value * this._base85 + this._decodingTable[code];
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
