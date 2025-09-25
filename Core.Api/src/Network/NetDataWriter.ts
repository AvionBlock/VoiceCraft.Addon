import { UTF8 } from "../Encoders/UTF8";

export class NetDataWriter {
  /**
   * @description Contains the raw buffer data the writer holds.
   */
  public get Data(): Uint8Array {
    return this._data;
  }
  /**
   * @description Contains the total length of the data that was written.
   */
  public get Length(): number {
    return this._offset;
  }
  /**
   * @description Determines whether the internal buffer should automatically resize when inputting new data.
   */
  public AutoResize = true;

  private _data: Uint8Array;
  private _offset: number = 0;
  private _dataView: DataView;

  constructor(buffer?: Uint8Array) {
    if (buffer !== undefined) this._data = buffer;
    else this._data = new Uint8Array();

    this._dataView = new DataView(this._data.buffer);
  }

  /**
   * @description Resizes the internal buffer to the new size if required.
   */
  public ResizeIfNeeded(newSize: number) {
    if (!this.AutoResize || this._data.length >= newSize) return;

    newSize = Math.max(newSize, this._data.length * 2);
    const newBuffer = new Uint8Array(newSize);
    newBuffer.set(this._data);

    this._data = newBuffer;
    this._dataView = new DataView(this._data.buffer); //new data view.
  }

  /**
   * @description Resets the writer.
   */
  Reset() {
    this._offset = 0;
  }

  /**
   * @description Writes a float value into the buffer.
   */
  public PutFloat(value: number) {
    this.ResizeIfNeeded(this._offset + 4);
    this._dataView.setFloat32(this._offset, value, true);
    this._offset += 4;
  }

  /**
   * @description Writes a double value into the buffer.
   */
  public PutDouble(value: number) {
    this.ResizeIfNeeded(this._offset + 8);
    this._dataView.setFloat64(this._offset, value, true);
    this._offset += 8;
  }

  /**
   * @description Writes a signed byte value into the buffer.
   */
  public PutSbyte(value: number) {
    this.ResizeIfNeeded(this._offset + 1);
    this._dataView.setInt8(this._offset, value);
    this._offset += 1;
  }

  /**
   * @description Writes a short value into the buffer.
   */
  public PutShort(value: number) {
    this.ResizeIfNeeded(this._offset + 2);
    this._dataView.setInt16(this._offset, value, true);
    this._offset += 2;
  }

  /**
   * @description Writes an int value into the buffer.
   */
  public PutInt(value: number) {
    this.ResizeIfNeeded(this._offset + 4);
    this._dataView.setInt32(this._offset, value, true);
    this._offset += 4;
  }

  /**
   * @description Writes a long value into the buffer.
   */
  public PutLong(value: bigint) {
    this.ResizeIfNeeded(this._offset + 8);
    this._dataView.setBigInt64(this._offset, value, true);
    this._offset += 8;
  }

  /**
   * @description Writes a byte value into the buffer.
   */
  public PutByte(value: number) {
    this.ResizeIfNeeded(this._offset + 1);
    this._dataView.setUint8(this._offset, value);
    this._offset += 1;
  }

  /**
   * @description Writes an unsigned short value into the buffer.
   */
  public PutUshort(value: number) {
    this.ResizeIfNeeded(this._offset + 2);
    this._dataView.setUint16(this._offset, value, true);
    this._offset += 2;
  }

  /**
   * @description Writes an unsigned int value into the buffer.
   */
  public PutUint(value: number) {
    this.ResizeIfNeeded(this._offset + 4);
    this._dataView.setUint32(this._offset, value, true);
    this._offset += 4;
  }

  /**
   * @description Writes an unsigned long value into the buffer.
   */
  public PutUlong(value: bigint) {
    this.ResizeIfNeeded(this._offset + 8);
    this._dataView.setBigUint64(this._offset, value, true);
    this._offset += 8;
  }

  /**
   * @description Writes a boolean value into the buffer.
   */
  public PutBool(value: boolean) {
    this.PutByte(value ? 1 : 0);
  }

  /**
   * @description Writes string value into the buffer.
   */
  public PutString(value: string, maxLength: number) {
    if (value.length <= 0) {
      this.PutUshort(0);
      return;
    }
    if (maxLength === undefined) maxLength = 0;

    const charCount =
      maxLength <= 0 || value.length <= maxLength ? value.length : maxLength;
    const maxByteCount = UTF8.GetMaxByteCount(charCount);
    this.ResizeIfNeeded(this._offset + maxByteCount + 2);

    const encodedBytes = UTF8.SetBytes(
      value,
      0,
      charCount,
      this._data,
      this._offset + 2
    );
    if (encodedBytes === 0) {
      this.PutUshort(0);
      return;
    }

    const encodedCount = encodedBytes + 1;
    if (encodedCount > 65535 || encodedBytes < 0)
      throw new RangeError("Exceeded allowed number of encoded bytes!");
    this.PutUshort(encodedCount);
    this._offset += encodedBytes;
  }

  /**
   * @description Writes byte values into the buffer
   */
  public PutBytes(value: Uint8Array, offset: number, length: number) {
    this.ResizeIfNeeded(this._offset + length);
    this._data.set(value.slice(offset, offset + length), this._offset);
    this._offset += length;
  }
}
