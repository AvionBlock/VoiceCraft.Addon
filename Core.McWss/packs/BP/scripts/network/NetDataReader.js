import { NetDataWriter } from "./NetDataWriter";
import * as utf8 from "../utf8";

class NetDataReader {
  /**
   * @description Contains the raw buffer data the the reader is set to.
   * @type { ArrayBuffer | undefined }
   */
  get data() {
    return this.#_data;
  }
  /**
   * @description Contains the length of the buffer when set, not the raw data length.
   * @type { Number }
   */
  get length() {
    return this.#_dataSize;
  }
  /**
   * @description Contains the offset in the raw data it is reading from.
   * @type { Number }
   */
  get offset() {
    return this.#_offset;
  }
  /**
   * @description Determines whether the buffer source has not been set.
   * @type { Boolean }
   */
  get isNull() {
    return this.#_data === undefined;
  }

  /** @type { ArrayBuffer } */
  #_data;
  /** @type { Number } */
  #_dataSize;
  /** @type { Number } */
  #_offset = 0;
  /** @type { DataView } */
  #_dataView;

  /**
   * @description Creates a new reader.
   * @param { NetDataWriter } writer
   */
  constructor(writer = undefined, buffer = undefined) {
    if (writer !== undefined) this.setWriterSource(writer);
    else if (buffer !== undefined) this.setBufferSource(buffer);
  }

  /**
   * @description Sets the reader's source.
   * @param { NetDataWriter } writer
   */
  setWriterSource(writer) {
    this.#_data = writer.data;
    this.#_offset = 0;
    this.#_dataSize = writer.length;
    this.#_dataView = new DataView(this.#_data);
  }

  /**
   * @description Sets the reader's source.
   * @param { ArrayBuffer } buffer
   */
  setBufferSource(buffer) {
    this.#_data = buffer;
    this.#_offset = 0;
    this.#_dataSize = buffer.byteLength;
    this.#_dataView = new DataView(this.#_data);
  }

  /**
   * @description Clear's the reader's source. Does not overwrite or reset the original source.
   * @param { ArrayBuffer }
   */

  clear() {
    this.#_offset = 0;
    this.#_dataSize = 0;
    this.#_data = undefined;
  }

  /**
   * @description Get's a float value from the buffer.
   * @returns { Number }
   */
  getFloat() {
    const value = this.#_dataView.getFloat32(this.#_offset);
    this.#_offset += 4;
    return value;
  }

  /**
   * @description Get's a double value from the buffer.
   * @returns { Number }
   */
  getDouble() {
    const value = this.#_dataView.getFloat64(this.#_offset);
    this.#_offset += 8;
    return value;
  }

  /**
   * @description Get's a signed byte value from the buffer.
   * @returns { Number }
   */
  getSbyte() {
    const value = this.#_dataView.getInt8(this.#_offset);
    this.#_offset += 1;
    return value;
  }

  /**
   * @description Get's a short value from the buffer.
   * @returns { Number }
   */
  getShort() {
    const value = this.#_dataView.getInt16(this.#_offset);
    this.#_offset += 2;
    return value;
  }

  /**
   * @description Get's an int value from the buffer.
   * @returns { Number }
   */
  getInt() {
    const value = this.#_dataView.getInt32(this.#_offset);
    this.#_offset += 4;
    return value;
  }

  /**
   * @description Get's a long value from the buffer.
   * @returns { Number }
   */
  getLong() {
    const value = this.#_dataView.getBigInt64(this.#_offset);
    this.#_offset += 8;
    return value;
  }

  /**
   * @description Get's a byte value from the buffer.
   * @returns { Number }
   */
  getByte() {
    const value = this.#_dataView.getUint8(this.#_offset);
    this.#_offset += 1;
    return value;
  }

  /**
   * @description Get's an unsigned short value from the buffer.
   * @returns { Number }
   */
  getUshort() {
    const value = this.#_dataView.getUint16(this.#_offset);
    this.#_offset += 2;
    return value;
  }

  /**
   * @description Get's an unsigned int value from the buffer.
   * @returns { Number }
   */
  getUint() {
    const value = this.#_dataView.getUint32(this.#_offset);
    this.#_offset += 4;
    return value;
  }

  /**
   * @description Get's an unsigned long value from the buffer.
   * @returns { Number }
   */
  getUlong() {
    const value = this.#_dataView.getBigUint64(this.#_offset);
    this.#_offset += 8;
    return value;
  }

  /**
   * @description Get's a string value from the buffer.
   * @returns { String }
   */
  getString() {
    const num = this.getUshort();
    if (num === 0) return "";

    const count = num - 1;
    const str = utf8.getString(this.#_data, this.#_offset, count);
    this.#_offset += count;
    return str;
  }
}

export { NetDataReader };
