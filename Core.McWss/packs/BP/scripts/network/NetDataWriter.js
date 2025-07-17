class NetDataWriter {
  /** @type { TextEncoder } */
  static _textEncoder = new TextEncoder();
  /** @type { TextDecoder } */
  static _textDecoder = new TextDecoder();

  /** @type { Array<ArrayBuffer> } */
  data = () => this._data;
  /** @type { Number } */
  capacity = () => this.data.length;
  /** @type { Number } */
  length = () => this._offset;
  /** @type { Boolean } */
  autoResize = false;

  /** @type { Array<ArrayBuffer> } */
  _data;
  /** @type { DataView } */
  _dataView;
  /** @type { Number } */
  _offset = 0;

  /**
   * @param { Array<ArrayBuffer> } buffer
   */
  constructor(buffer = undefined) {
    if (buffer !== undefined) this._data = buffer;
    else this._data = new ArrayBuffer();
    this._dataView = new DataView(this._data);
  }

  /**
   * @param { Number } newSize
   */
  resizeIfNeed(newSize) {
    if (!autoResize || this._data.Length >= newSize) return;

    newSize = Math.max(newSize, this._data.length * 2);
    while (newSize > this._data.length) this._data.push(0);
    this.data.length = newSize;
  }

  reset() {
    this._offset = 0;
  }

  /**
   * @param { Number } value
   */
  putFloat(value) {
    this.resizeIfNeed(this._offset + 4);
    this._dataView.setFloat32(this._offset, value);
    this._offset += 4;
  }

  /**
   * @param { Number } value
   */
  putDouble(value) {
    this.resizeIfNeed(this._offset + 8);
    this._dataView.setFloat64(this._offset, value);
    this._offset += 8;
  }

  /**
   * @param { Number } value
   */
  putSbyte(value) {
    this.resizeIfNeed(this._offset + 1);
    this._dataView.setInt8(this._offset, value);
    this._offset += 1;
  }

  /**
   * @param { Number } value
   */
  putShort(value) {
    this.resizeIfNeed(this._offset + 2);
    this._dataView.setInt16(this._offset, value);
    this._offset += 2;
  }

  /**
   * @param { Number } value
   */
  putInt(value) {
    this.resizeIfNeed(this._offset + 4);
    this._dataView.setInt32(this._offset, value);
    this._offset += 4;
  }

  /**
   * @param { Number } value
   */
  putLong(value) {
    this.resizeIfNeed(this._offset + 8);
    this._dataView.setBigInt64(this._offset, value);
    this._offset += 8;
  }

  /**
   * @param { Number } value
   */
  putByte(value) {
    this.resizeIfNeed(this._offset + 1);
    this._dataView.setUint8(this._offset, value);
    this._offset += 1;
  }

  /**
   * @param { Number } value
   */
  putUshort(value) {
    this.resizeIfNeed(this._offset + 2);
    this._dataView.setUint16(this._offset, value);
    this._offset += 2;
  }

  /**
   * @param { Number } value
   */
  putUint(value) {
    this.resizeIfNeed(this._offset + 4);
    this._dataView.setUint32(this._offset, value);
    this._offset += 4;
  }

  /**
   * @param { Number } value
   */
  putUlong(value) {
    this.resizeIfNeed(this._offset + 8);
    this._dataView.setBigUint64(this._offset, value);
    this._offset += 8;
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

    const charCount =
      maxLength <= 0 || value.length <= maxLength ? value.length : maxLength;
    const encodedData = NetDataWriter._textEncoder.encode(
      value.slice(0, charCount)
    );
    this.resizeIfNeed(this._offset + encodedData.length + 2);

    if(encodedData === 0)
    {
        this.putUshort(0);
        return;
    }

    this.putUshort(encodedData.length + 1);
    this._offset += encodedData.length;
  }
}