/**
 * @description Encodes a range of characters from a string into a byte array.
 * @param { String } s
 * @param { Number } charIndex
 * @param { Number } charCount
 * @param { ArrayBuffer } bytes
 * @param { Number } byteIndex
 * @returns { Number } The number of bytes that were successfully encoded.
 */
function getBytes(s, charIndex, charCount, bytes, byteIndex) {
  if (typeof s !== "string")
    throw new TypeError("Parameter s is not a string!");
  if (typeof charIndex !== "number")
    throw new TypeError("Parameter charIndex is not a number!");
  if (typeof charCount !== "number")
    throw new TypeError("Parameter charCount is not a number!");
  if (!(bytes instanceof ArrayBuffer))
    throw new TypeError("Parameter bytes is not an instance of ArrayBuffer!");
  if (typeof byteIndex !== "number")
    throw new TypeError("Parameter byteIndex is not a number!");
  if (s.length - charIndex < charCount)
    throw new RangeError("Argument out of range!", { cause: "s" });
  if (byteIndex > bytes.byteLength)
    throw new RangeError(
      "Byte Index must be less than or equal to bytes.byteLength!",
      { cause: "byteIndex" }
    );

  charCount = Math.min(charCount, s.length);
  let bytesEncoded = 0;
  for (let i = charIndex; i < charIndex + charCount; i++) {
    const charCode = s.charCodeAt(i);
    if (charCode <= 0x7f) {
      // 0XXX XXXX 1 byte
      bytes[byteIndex++] = charCode;
      bytesEncoded++;
    } else if (charCode <= 0x7ff) {
      // 110X XXXX 2 bytes
      bytes[byteIndex++] = 0xc0 | (charCode >> 6);
      bytes[byteIndex++] = 0x80 | (charCode & 0x3f);
      bytesEncoded += 2;
    } else if (charCode <= 0xffff) {
      // 1110 XXXX 3 bytes
      bytes[byteIndex++] = 0xe0 | (charCode >> 12);
      bytes[byteIndex++] = 0x80 | ((charCode >> 6) & 0x3f);
      bytes[byteIndex++] = 0x80 | (charCode & 0x3f);
      bytesEncoded += 3;
    }
  }

  return bytesEncoded;
}

/**
 * @description Decodes a range of bytes from a byte array into a string.
 * @param { ArrayBuffer } bytes
 * @param { Number } byteIndex
 * @param { Number } count
 * @returns { String } The decoded string.
 */
function getString(bytes, index, count) {
  if (!(bytes instanceof ArrayBuffer))
    throw new TypeError("Parameter bytes is not an instance of ArrayBuffer!");
  if (typeof index !== "number")
    throw new TypeError("Parameter index is not a number!");
  if (typeof count !== "number")
    throw new TypeError("Parameter count is not a number!");
  if (bytes.byteLength - index < count)
    throw new RangeError("Argument out of range!");

  var string = "";
  const maxIndex = count + index;
  while (index < maxIndex) {
    const byte = bytes[index++];
    if ((byte & 0x80) === 0) {
      string = string.concat(String.fromCharCode(byte));
    } else if ((byte & 0xe0) == 0xc0) {
      const byte2 = bytes[index++];
      string = string.concat(
        String.fromCharCode(((byte & 0x1f) << 6) | (byte2 & 0x3f))
      );
    } else if ((byte & 0xf0) == 0xe0) {
      const byte2 = bytes[index++];
      const byte3 = bytes[index++];
      string = string.concat(
        String.fromCharCode(
          ((byte & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f)
        )
      );
    } else if ((byte & 0xf8) == 0xf0) {
      const byte2 = bytes[index++];
      const byte3 = bytes[index++];
      const byte4 = bytes[index++];
      string = string.concat(
        String.fromCharCode(
          ((byte & 0x0f) << 18) |
            ((byte2 & 0x3f) << 12) |
            ((byte3 & 0x3f) << 6) |
            (byte4 & 0x3f)
        )
      );
    }
  }

  return string;
}

/**
 * @description Calculates the maximum number of bytes produced by encoding the specified number of characters.
 * @param { Number } charCount
 * @returns { Number } The maximum possible number of bytes required to encode.
 */
function getMaxByteCount(charCount) {
  const num1 = charCount + 1;
  const num2 = num1 * 3;
  return num2;
}

export { getBytes, getString, getMaxByteCount };