import { NetDataWriter } from "./NetDataWriter";

class NetDataReader {
  /** @type { TextEncoder } */
  static _textEncoder = new TextEncoder();
  /** @type { TextDecoder } */
  static _textDecoder = new TextDecoder();

  /** @type { ArrayBuffer } */
  data = () => this._data;
  /** @type { Number } */
  offset = () => this._offset;

  /** @type { ArrayBuffer } */
  _data;
  /** @type { Number } */
  _dataSize;
  /** @type { Number } */
  _offset = 0;

  /** @type { DataView } */
  _dataView;

  /**
   * @param { NetDataWriter } writer 
   */
  setSource(writer)
  {
    this.data = writer.data;
    this._offset = 0;
    this._dataSize = writer.length;
  }

  /**
   * @param { ArrayBuffer } source
   */
  setSource(source)
  {
    this._data = source;
    this._offset = 0;
    this._dataSize = source.byteLength;
  }

  /**
   * @param { ArrayBuffer }
   */

  reset() {
    this._offset = 0;
  }

  /**
   * @returns { Number }
   */
  getFloat() {
    const value = this._dataView.getFloat32(this._offset);
    this._offset += 4;
    return value;
  }

  /**
   * @returns { Number }
   */
  getDouble() {
    const value = this._dataView.getFloat64(this._offset);
    this._offset += 8;
    return value;
  }

  /**
   * @returns { Number }
   */
  getSbyte() {
    const value = this._dataView.getInt8(this._offset);
    this._offset += 1;
    return value;
  }

  /**
   * @returns { Number }
   */
  getShort() {
    const value = this._dataView.getInt16(this._offset);
    this._offset += 2;
    return value;
  }

  /**
   * @returns { Number }
   */
  getInt() {
    const value = this._dataView.getInt32(this._offset);
    this._offset += 4;
    return value;
  }

  /**
   * @returns { Number }
   */
  getLong() {
    const value = this._dataView.getBigInt64(this._offset);
    this._offset += 8;
    return value;
  }

  /**
   * @returns { Number }
   */
  getByte() {
    const value = this._dataView.getUint8(this._offset);
    this._offset += 1;
    return value;
  }

  /**
   * @returns { Number }
   */
  getUshort() {
    const value = this._dataView.getUint16(this._offset);
    this._offset += 2;
    return value;
  }

  /**
   * @returns { Number }
   */
  getUint() {
    const value = this._dataView.getUint32(this._offset);
    this._offset += 4;
    return value;
  }

  /**
   * @returns { Number }
   */
  getUlong() {
    const value = this._dataView.getBigUint64(this._offset);
    this._offset += 8;
    return value;
  }

  /**
   * @param { Number } maxLength
   * @returns { String }
   */
  getString(maxLength) {
    const num = this.getUshort();
    if(num === 0)
      return "";

    const count = num - 1;
    const stringSection = this._data.slice(this._offset, count);
    let str = NetDataReader._textDecoder.decode(stringSection);
    if(maxLength > 0 && str.length > maxLength)
      str = ""; //Return empty string.

    this._offset += count;
    return str;
  }
}

export { NetDataReader }