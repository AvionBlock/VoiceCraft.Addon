import * as utf8 from "../utf8";

class NetDataWriter {
  /** @type { ArrayBuffer } */
  get data() {
    return this.#_data;
  }
  /** @type { Number } */
  get capacity() {
    return this.#_data.byteLength;
  }
  /** @type { Number } */
  get length() {
    return this.#_offset;
  }
  /** @type { Boolean } */
  autoResize = true;

  /** @type { ArrayBuffer } */
  #_data;
  /** @type { Uint8Array } */
  #_uint8Data;
  /** @type { Number } */
  #_offset = 0;
  /** @type { DataView } */
  #_dataView;

  /**
   * @param { ArrayBuffer } buffer
   */
  constructor(buffer = undefined) {
    if (buffer !== undefined) this.#_data = buffer;
    else this.#_data = new ArrayBuffer();
    this.#_uint8Data = new Uint8Array(this.#_data);
    this.#_dataView = new DataView(this.#_data);
  }

  /**
   * @param { Number } newSize
   */
  resizeIfNeed(newSize) {
    if (!this.autoResize || this.#_data.byteLength >= newSize) return;

    newSize = Math.max(newSize, this.#_data.byteLength * 2);
    const newBuffer = new ArrayBuffer(newSize);
    const newUint8Buffer = new Uint8Array(newBuffer);
    newUint8Buffer.set(this.#_uint8Data);

    this.#_data = newBuffer;
    this.#_uint8Data = newUint8Buffer;
    this.#_dataView = new DataView(this.#_data); //new data view.
  }

  reset() {
    this.#_offset = 0;
  }

  /**
   * @param { Number } value
   */
  putFloat(value) {
    this.resizeIfNeed(this.#_offset + 4);
    this.#_dataView.setFloat32(this.#_offset, value);
    this.#_offset += 4;
  }

  /**
   * @param { Number } value
   */
  putDouble(value) {
    this.resizeIfNeed(this.#_offset + 8);
    this.#_dataView.setFloat64(this.#_offset, value);
    this.#_offset += 8;
  }

  /**
   * @param { Number } value
   */
  putSbyte(value) {
    this.resizeIfNeed(this.#_offset + 1);
    this.#_dataView.setInt8(this.#_offset, value);
    this.#_offset += 1;
  }

  /**
   * @param { Number } value
   */
  putShort(value) {
    this.resizeIfNeed(this.#_offset + 2);
    this.#_dataView.setInt16(this.#_offset, value);
    this.#_offset += 2;
  }

  /**
   * @param { Number } value
   */
  putInt(value) {
    this.resizeIfNeed(this.#_offset + 4);
    this.#_dataView.setInt32(this.#_offset, value);
    this.#_offset += 4;
  }

  /**
   * @param { Number } value
   */
  putLong(value) {
    this.resizeIfNeed(this.#_offset + 8);
    this.#_dataView.setBigInt64(this.#_offset, value);
    this.#_offset += 8;
  }

  /**
   * @param { Number } value
   */
  putByte(value) {
    this.resizeIfNeed(this.#_offset + 1);
    this.#_dataView.setUint8(this.#_offset, value);
    this.#_offset += 1;
  }

  /**
   * @param { Number } value
   */
  putUshort(value) {
    this.resizeIfNeed(this.#_offset + 2);
    this.#_dataView.setUint16(this.#_offset, value);
    this.#_offset += 2;
  }

  /**
   * @param { Number } value
   */
  putUint(value) {
    this.resizeIfNeed(this.#_offset + 4);
    this.#_dataView.setUint32(this.#_offset, value);
    this.#_offset += 4;
  }

  /**
   * @param { Number } value
   */
  putUlong(value) {
    this.resizeIfNeed(this.#_offset + 8);
    this.#_dataView.setBigUint64(this.#_offset, value);
    this.#_offset += 8;
  }

  /**
   * @param { String } value
   * @param { Number } maxLength
   */
  putString(value, maxLength) {
    if (value.length <= 0) {
      this.putUshort(0);
      return;
    }
    if (maxLength === undefined) maxLength = 0;

    const charCount =
      maxLength <= 0 || value.length <= maxLength ? value.length : maxLength;
    const maxByteCount = utf8.getMaxByteCount(charCount);
    this.resizeIfNeed(this.#_offset + maxByteCount + 2);

    const encodedBytes = utf8.getBytes(
      value,
      0,
      charCount,
      this.#_data,
      this.#_offset + 2
    );
    if (encodedBytes === 0) {
      this.putUshort(0);
      return;
    }

    const encodedCount = encodedBytes + 1;
    if (encodedCount > 65535 || encodedBytes < 0)
      throw new RangeError("Exceeded allowed number of encoded bytes!");
    this.putUshort(encodedCount);
    this.#_offset += encodedBytes;
  }
}

export { NetDataWriter };