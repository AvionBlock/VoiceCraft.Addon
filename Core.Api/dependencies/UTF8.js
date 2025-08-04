export class UTF8 {
  constructor() {
    throw new Error("Cannot initialize a static class!");
  }

  /**
   * @description Encodes a string into a Uint8Array.
   * @param { String } s
   * @returns { Uint8Array | undefined }
   */
  static getBytes(s) {
    if (typeof s !== "string")
      throw new TypeError("Parameter s is not a string!");

    const byteCount = this.getByteCount(s);
    if (byteCount === 0) return undefined;

    const bytes = new Uint8Array(byteCount);
    this.setBytes(s, 0, s.length, bytes, 0);
    return bytes;
  }

  /**
   * @description Encodes a range of characters from a string into a Uint8Array.
   * @param { String } s
   * @param { Number } charIndex
   * @param { Number } charCount
   * @param { Uint8Array } bytes
   * @param { Number } byteIndex
   * @returns { Number } The number of bytes that were successfully encoded.
   */
  static setBytes(s, charIndex, charCount, bytes, byteIndex) {
    if (typeof s !== "string")
      throw new TypeError("Parameter s is not a string!");
    if (typeof charIndex !== "number")
      throw new TypeError("Parameter charIndex is not a number!");
    if (typeof charCount !== "number")
      throw new TypeError("Parameter charCount is not a number!");
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof byteIndex !== "number")
      throw new TypeError("Parameter byteIndex is not a number!");
    if (s.length - charIndex < charCount)
      throw new RangeError("Argument out of range!", { cause: "s" });
    if (byteIndex > bytes.length)
      throw new RangeError(
        "Byte Index must be less than or equal to bytes.length!",
        { cause: "byteIndex" }
      );

    charCount = Math.min(charCount, s.length);
    let bytesEncoded = 0;
    for (let i = charIndex; i < charIndex + charCount; i++) {
      const charCode = s.charCodeAt(i);
      const byteCount = this.setBytesFromCharCode(charCode, bytes, byteIndex);
      if (byteCount === undefined) continue;
      bytesEncoded += byteCount;
      byteIndex += byteCount;
    }

    return bytesEncoded;
  }

  /**
   * @description Decodes a range of bytes from a Uint8Array into a string.
   * @param { Uint8Array } bytes
   * @param { Number } byteIndex
   * @param { Number } count
   * @returns { String } The decoded string.
   */
  static getString(bytes, index, count) {
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof index !== "number")
      throw new TypeError("Parameter index is not a number!");
    if (typeof count !== "number")
      throw new TypeError("Parameter count is not a number!");
    if (bytes.length - index < count)
      throw new RangeError("Count argument out of range!");

    /** @type { Number[] } */
    const charCodes = [];
    const maxIndex = count + index;
    while (index < maxIndex) {
      const charCode = this.getCharCodeFromBytes(bytes, index);
      if (charCode !== undefined) {
        charCodes.push(charCode);
        index += this.getByteCountFromCharCode(charCode); //We know it's a valid utf8 character.
        continue;
      }

      index++;
    }

    return String.fromCharCode.apply(null, charCodes);
  }

  //#region Byte Count Stuff
  /**
   * @description Calculates the exact number of bytes required to encode the string.
   * @param { String } chars
   * @returns { Number } The number of bytes that is required to encode the string.
   */
  static getByteCount(chars) {
    if (typeof chars !== "string")
      throw new TypeError("Parameter chars is not a string!");

    let charCount = 0;
    for (let i = 0; i < chars.length; i++) {
      const byteCount = this.getByteCountFromCharCode(chars.charCodeAt(i));
      if (byteCount === undefined) continue;
      charCount += byteCount;
    }

    return charCount;
  }
  //#endregion

  /**
   * @description Calculates the maximum number of bytes produced by encoding the specified number of characters.
   * @param { Number } charCount
   * @returns { Number } The maximum possible number of bytes required to encode.
   */
  static getMaxByteCount(charCount) {
    if (typeof charCount !== "number")
      throw new TypeError("Parameter charCount is not a number!");

    return (charCount + 1) * 3;
  }

  //#region Charcode Stuff
  /**
   * @description Calculates the required numbers of bytes to encode the specified char code.
   * @param { Number } charCode
   * @returns { Number | undefined }
   */
  static getByteCountFromCharCode(charCode) {
    if (typeof charCode !== "number")
      throw new TypeError("Parameter charCode is not a number!");

    if (charCode <= 0x7f) {
      return 1;
    } else if (charCode <= 0x7ff) {
      return 2;
    } else if (charCode <= 0xffff) {
      return 3;
    }
    return undefined;
  }

  /**
   * @description Get's a Uint8Array with the encoded bytes for the specified charcode.
   * @param { Number } charCode
   * @returns { Uint8Array | undefined }
   */
  static getBytesFromCharCode(charCode) {
    if (typeof charCode !== "number")
      throw new TypeError("Parameter charCode is not a number!");

    const byteCount = this.getByteCountFromCharCode(charCode);
    if (byteCount === undefined) return undefined;

    const bytes = new Uint8Array(byteCount);
    this.setBytesFromCharCode(charCode, bytes, 0);
    return bytes;
  }

  /**
   * @description Sets a Uint8Array with the encoded bytes for the specified charcode.
   * @param { Number } charCode
   * @param { Uint8Array } bytes
   * @param { Number } index
   * @returns { Number | undefined } The number of bytes encoded.
   */
  static setBytesFromCharCode(charCode, bytes, index) {
    if (typeof charCode !== "number")
      throw new TypeError("Parameter charCode is not a number!");
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof index !== "number")
      throw new TypeError("Parameter index is not a number!");

    let byteCount = this.getByteCountFromCharCode(charCode);
    switch (byteCount) {
      case 1:
        if (bytes.length < index) {
          byteCount = undefined;
          break;
        }

        bytes[index] = charCode;
        break;
      case 2:
        if (bytes.length < index + 1) {
          byteCount = undefined;
          break;
        }

        bytes[index++] = 0xc0 | (charCode >> 6);
        bytes[index] = 0x80 | (charCode & 0x3f);
        break;
      case 3:
        if (bytes.length < index + 2) {
          byteCount = undefined;
          break;
        }

        bytes[index++] = 0xe0 | (charCode >> 12);
        bytes[index++] = 0x80 | ((charCode >> 6) & 0x3f);
        bytes[index] = 0x80 | (charCode & 0x3f);
        break;
    }

    return byteCount;
  }

  /**
   * @description Get's a charcode from the specified Uint8Array at index.
   * @param { Uint8Array } bytes
   * @param { Number } index
   * @returns { Number | undefined }
   */
  static getCharCodeFromBytes(bytes, index) {
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof index !== "number")
      throw new TypeError("Parameter index is not a number!");
    if (bytes.length < index)
      throw new RangeError("Index argument out of range!");

    const byte = bytes[index];
    if ((byte & 0x80) === 0) {
      return byte;
    } else if ((byte & 0xe0) == 0xc0) {
      const byte2 = bytes[++index];
      return ((byte & 0x1f) << 6) | (byte2 & 0x3f);
    } else if ((byte & 0xf0) == 0xe0) {
      const byte2 = bytes[++index];
      const byte3 = bytes[++index];
      return ((byte & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f);
    } else if ((byte & 0xf8) == 0xf0) {
      const byte2 = bytes[++index];
      const byte3 = bytes[++index];
      const byte4 = bytes[++index];
      return (
        ((byte & 0x0f) << 18) |
        ((byte2 & 0x3f) << 12) |
        ((byte3 & 0x3f) << 6) |
        (byte4 & 0x3f)
      );
    }

    return undefined;
  }
  //#endregion
}
