import UTF8 from "../utf8";

export default class NetDataWriter {
  /**
   * @description Contains the raw buffer data the writer holds.
   * @type { ArrayBuffer }
   */
  get data() {
    return this.#_data;
  }
  /**
   * @description Contains the raw buffer data the writer holds in byte array data format.
   * @type { Uint8Array }
   */
  get uint8Data() {
    return this.#_uint8Data;
  }
  /**
   * @description Contains the total length of the data that was written.
   * @type { Number }
   */
  get length() {
    return this.#_offset;
  }
  /**
   * @description Determines whether the internal buffer should automatically resize when inputting new data.
   * @type { Boolean }
   */
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
   * @description Creates a new writer.
   * @param { ArrayBuffer } buffer
   */
  constructor(buffer = undefined) {
    if (buffer !== undefined) this.#_data = buffer;
    else this.#_data = new ArrayBuffer();
    this.#_uint8Data = new Uint8Array(this.#_data);
    this.#_dataView = new DataView(this.#_data);
  }

  /**
   * @description Resizes the internal buffer to the new size if required.
   * @param { Number } newSize
   */
  resizeIfNeeded(newSize) {
    if (!this.autoResize || this.#_data.byteLength >= newSize) return;

    newSize = Math.max(newSize, this.#_data.byteLength * 2);
    const newBuffer = new ArrayBuffer(newSize);
    const newUint8Buffer = new Uint8Array(newBuffer);
    newUint8Buffer.set(this.#_uint8Data);

    this.#_data = newBuffer;
    this.#_uint8Data = newUint8Buffer;
    this.#_dataView = new DataView(this.#_data); //new data view.
  }

  /**
   * @description Resets the writer.
   */
  reset() {
    this.#_offset = 0;
  }

  /**
   * @description Writes a float value into the buffer.
   * @param { Number } value
   */
  putFloat(value) {
    this.resizeIfNeeded(this.#_offset + 4);
    this.#_dataView.setFloat32(this.#_offset, value);
    this.#_offset += 4;
  }

  /**
   * @description Writes a double value into the buffer.
   * @param { Number } value
   */
  putDouble(value) {
    this.resizeIfNeeded(this.#_offset + 8);
    this.#_dataView.setFloat64(this.#_offset, value);
    this.#_offset += 8;
  }

  /**
   * @description Writes a signed byte value into the buffer.
   * @param { Number } value
   */
  putSbyte(value) {
    this.resizeIfNeeded(this.#_offset + 1);
    this.#_dataView.setInt8(this.#_offset, value);
    this.#_offset += 1;
  }

  /**
   * @description Writes a short value into the buffer.
   * @param { Number } value
   */
  putShort(value) {
    this.resizeIfNeeded(this.#_offset + 2);
    this.#_dataView.setInt16(this.#_offset, value);
    this.#_offset += 2;
  }

  /**
   * @description Writes an int value into the buffer.
   * @param { Number } value
   */
  putInt(value) {
    this.resizeIfNeeded(this.#_offset + 4);
    this.#_dataView.setInt32(this.#_offset, value);
    this.#_offset += 4;
  }

  /**
   * @description Writes a long value into the buffer.
   * @param { Number } value
   */
  putLong(value) {
    this.resizeIfNeeded(this.#_offset + 8);
    this.#_dataView.setBigInt64(this.#_offset, value);
    this.#_offset += 8;
  }

  /**
   * @description Writes a byte value into the buffer.
   * @param { Number } value
   */
  putByte(value) {
    this.resizeIfNeeded(this.#_offset + 1);
    this.#_dataView.setUint8(this.#_offset, value);
    this.#_offset += 1;
  }

  /**
   * @description Writes an unsigned short value into the buffer.
   * @param { Number } value
   */
  putUshort(value) {
    this.resizeIfNeeded(this.#_offset + 2);
    this.#_dataView.setUint16(this.#_offset, value);
    this.#_offset += 2;
  }

  /**
   * @description Writes an unsigned int value into the buffer.
   * @param { Number } value
   */
  putUint(value) {
    this.resizeIfNeeded(this.#_offset + 4);
    this.#_dataView.setUint32(this.#_offset, value);
    this.#_offset += 4;
  }

  /**
   * @description Writes an unsigned long value into the buffer.
   * @param { Number } value
   */
  putUlong(value) {
    this.resizeIfNeeded(this.#_offset + 8);
    this.#_dataView.setBigUint64(this.#_offset, value);
    this.#_offset += 8;
  }

  /**
   * @description Writes string value into the buffer.
   * @param { String } value
   * @param { Number } maxLength
   */
  putString(value, maxLength) {
    if (value.length <= 0) {
      this.putUshort(0);
      return;
    }
    if (maxLength === undefined)
      maxLength = 0;

    const charCount =
      maxLength <= 0 || value.length <= maxLength ? value.length : maxLength;
    const maxByteCount = UTF8.getMaxByteCount(charCount);
    this.resizeIfNeeded(this.#_offset + maxByteCount + 2);

    const encodedBytes = UTF8.setBytes(
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