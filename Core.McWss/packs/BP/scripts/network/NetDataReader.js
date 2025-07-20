import { NetDataWriter } from "./NetDataWriter";
import * as utf8 from "../utf8";

class NetDataReader {
  /** @type { ArrayBuffer } */
  get data() {
    return this.#_data;
  }
  /** @type { Number } */
  get length() {
    return this.#_dataSize;
  }
  /** @type { Number } */
  get offset() {
    return this.#_offset;
  }
  /** @type { Boolean } */
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
   * @param { NetDataWriter } writer
   */
  constructor(writer = undefined, buffer = undefined) {
    if (writer !== undefined) this.setWriterSource(writer);
    else if (buffer !== undefined) this.setBufferSource(buffer);
  }

  /**
   * @param { NetDataWriter } writer
   */
  setWriterSource(writer) {
    this.#_data = writer.data;
    this.#_offset = 0;
    this.#_dataSize = writer.length;
    this.#_dataView = new DataView(this.#_data);
  }

  /**
   * @param { ArrayBuffer } buffer
   */
  setBufferSource(buffer) {
    this.#_data = buffer;
    this.#_offset = 0;
    this.#_dataSize = buffer.byteLength;
    this.#_dataView = new DataView(this.#_data);
  }

  /**
   * @param { ArrayBuffer }
   */

  clear() {
    this.#_offset = 0;
    this.#_dataSize = 0;
    this.#_data = undefined;
  }

  /**
   * @returns { Number }
   */
  getFloat() {
    const value = this.#_dataView.getFloat32(this.#_offset);
    this.#_offset += 4;
    return value;
  }

  /**
   * @returns { Number }
   */
  getDouble() {
    const value = this.#_dataView.getFloat64(this.#_offset);
    this.#_offset += 8;
    return value;
  }

  /**
   * @returns { Number }
   */
  getSbyte() {
    const value = this.#_dataView.getInt8(this.#_offset);
    this.#_offset += 1;
    return value;
  }

  /**
   * @returns { Number }
   */
  getShort() {
    const value = this.#_dataView.getInt16(this.#_offset);
    this.#_offset += 2;
    return value;
  }

  /**Output 3: ${reader.getString()
   * @returns { Number }
   */
  getInt() {
    const value = this.#_dataView.getInt32(this.#_offset);
    this.#_offset += 4;
    return value;
  }

  /**
   * @returns { Number }
   */
  getLong() {
    const value = this.#_dataView.getBigInt64(this.#_offset);
    this.#_offset += 8;
    return value;
  }

  /**
   * @returns { Number }
   */
  getByte() {
    const value = this.#_dataView.getUint8(this.#_offset);
    this.#_offset += 1;
    return value;
  }

  /**
   * @returns { Number }
   */
  getUshort() {
    const value = this.#_dataView.getUint16(this.#_offset);
    this.#_offset += 2;
    return value;
  }

  /**
   * @returns { Number }
   */
  getUint() {
    const value = this.#_dataView.getUint32(this.#_offset);
    this.#_offset += 4;
    return value;
  }

  /**
   * @returns { Number }
   */
  getUlong() {
    const value = this.#_dataView.getBigUint64(this.#_offset);
    this.#_offset += 8;
    return value;
  }

  /**
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