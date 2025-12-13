export class Z85 {
  private static readonly Base85 = 85;

  private static readonly EncodingTable = [
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

  private static readonly DecodingTable = [
    0, 68, 0, 84, 83, 82, 72, 0, 75, 76, 70, 65, 0, 63, 62, 69, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 64, 0, 73, 66, 74, 71, 81,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 77, 0, 78,
    67, 0, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    79, 0, 80, 0, 0,
  ];

  public static GetStringWithPadding(data: Uint8Array) {
    let lengthMod4 = data.length % 4;
    let paddingRequired = lengthMod4 !== 0;
    let bytesToEncode = data;
    let bytesToPad = 0;
    if (paddingRequired) {
      bytesToPad = 4 - lengthMod4;
      bytesToEncode = new Uint8Array(data.length + bytesToPad);
      bytesToEncode.set(data);
    }

    let z85String = this.GetString(bytesToEncode);
    if (paddingRequired) {
      z85String = z85String.concat(bytesToPad.toString());
    }
    return z85String;
  }

  public static GetString(data: Uint8Array) {
    let stringBuilder = "";
    let encodedChars = new Array<string>(5);

    for (let i = 0; i < data.length; i += 4) {
      //>>> 0 converts to uint. fsr this is a JS thing.
      let binaryFrame = ((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3]) >>> 0;

      let divisor = this.Base85 * this.Base85 * this.Base85 * this.Base85;
      for (let j = 0; j < 5; j++) {
        let divisible = Math.trunc((binaryFrame / divisor) % 85);
        encodedChars[j] = this.EncodingTable[divisible];
        binaryFrame -= divisible * divisor;
        divisor = Math.trunc(divisor / this.Base85);
      }

      stringBuilder = stringBuilder.concat(encodedChars.join(""));
    }

    return stringBuilder;
  }

  public static GetBytesWithPadding(data: string) {
    let lengthMod5 = data.length % 5;
    if (lengthMod5 != 0 && (data.length - 1) % 5 != 0)
      throw new Error("Input length must be a multiple of 5 with either padding or no padding.");

    let paddedBytes = 0;
    if (lengthMod5 != 0) {
      paddedBytes = Number.parseInt(data[data.length - 1]);
      if (!paddedBytes || paddedBytes < 1 || paddedBytes > 3) {
        throw new Error("Invalid padding character for a Z85 string.");
      }

      data = data.slice(0, data.length - 1);
    }

    let output = this.GetBytes(data);
    //Remove padded bytes
    if (paddedBytes > 0) output = output.slice(0, output.length - paddedBytes);
    return output;
  }

  public static GetBytes(data: string) {
    if (data.length % 5 != 0) throw new Error("Input length must be a multiple of 5");

    let output = new Uint8Array((data.length / 5) * 4);
    let outputIndex = 0;
    for (let i = 0; i < data.length; i += 5) {
      let value = 0;
      value = value * this.Base85 + this.DecodingTable[data.charCodeAt(i) - 32];
      value = value * this.Base85 + this.DecodingTable[data.charCodeAt(i + 1) - 32];
      value = value * this.Base85 + this.DecodingTable[data.charCodeAt(i + 2) - 32];
      value = value * this.Base85 + this.DecodingTable[data.charCodeAt(i + 3) - 32];
      value = value * this.Base85 + this.DecodingTable[data.charCodeAt(i + 4) - 32];

      output[outputIndex] = value >> 24;
      output[outputIndex + 1] = value >> 16;
      output[outputIndex + 2] = value >> 8;
      output[outputIndex + 3] = value;
      outputIndex += 4;
    }

    return output;
  }
}
