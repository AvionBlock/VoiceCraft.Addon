import { NetDataWriter } from "./NetDataWriter";
import { UTF8 } from "../Encoders/UTF8";

export class NetDataReader {
  /**
   * @description Contains the raw buffer data the the reader is set to.
   */
  public get Data(): Uint8Array | undefined {
    return this._data;
  }
  /**
   * @description Contains the length of the buffer when set, not the raw data length.
   */
  public get Length(): number {
    return this._dataSize;
  }
  /**
   * @description Contains the offset in the raw data it is reading from.
   */
  public get Offset(): number {
    return this._offset;
  }
  /**
   * @description Determines whether the buffer source has not been set.
   */
  public get IsNull(): boolean {
    return this._data === undefined;
  }
  /**
   * @description Determines whether the buffer has been fully read.
   */
  public get EndOfData(): boolean {
    return this._offset === this._dataSize;
  }
  /**
   * @description Calculates how many bytes are left to read.
   */
  public get AvailableBytes(): number {
    return this._dataSize - this._offset;
  }

  private _data?: Uint8Array;
  private _dataSize: number = 0;
  private _offset: number = 0;
  private _dataView?: DataView;

  /**
   * @description Creates a new reader.
   */
  constructor(buffer?: NetDataWriter | Uint8Array) {
    if (buffer instanceof NetDataWriter) this.SetWriterSource(buffer);
    else if (buffer instanceof Uint8Array) this.SetBufferSource(buffer);
  }

  /**
   * @description Sets the reader's source.
   */
  public SetWriterSource(writer: NetDataWriter) {
    this._data = writer.Data;
    this._offset = 0;
    this._dataSize = writer.Length;
    this._dataView = new DataView(this._data.buffer);
  }

  /**
   * @description Sets the reader's source.
   */
  SetBufferSource(buffer: Uint8Array) {
    this._data = buffer;
    this._offset = 0;
    this._dataSize = buffer.length;
    this._dataView = new DataView(this._data.buffer);
  }

  /**
   * @description Clear's the reader's source. Does not overwrite or reset the original source.
   */

  public Clear() {
    this._offset = 0;
    this._dataSize = 0;
    this._data = undefined;
  }

  /**
   * @description Get's a float value from the buffer.
   */
  public GetFloat(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getFloat32(this._offset, true);
    this._offset += 4;
    return value;
  }

  /**
   * @description Get's a double value from the buffer.
   */
  public GetDouble(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getFloat64(this._offset, true);
    this._offset += 8;
    return value;
  }

  /**
   * @description Get's a signed byte value from the buffer.
   */
  public GetSbyte(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getInt8(this._offset);
    this._offset += 1;
    return value;
  }

  /**
   * @description Get's a short value from the buffer.
   */
  public GetShort(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getInt16(this._offset, true);
    this._offset += 2;
    return value;
  }

  /**
   * @description Get's an int value from the buffer.
   */
  public GetInt(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getInt32(this._offset, true);
    this._offset += 4;
    return value;
  }

  /**
   * @description Get's a long value from the buffer.
   */
  public GetLong(): bigint {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getBigInt64(this._offset, true);
    this._offset += 8;
    return value;
  }

  /**
   * @description Get's a byte value from the buffer.
   */
  public GetByte(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getUint8(this._offset);
    this._offset += 1;
    return value;
  }

  /**
   * @description Get's an unsigned short value from the buffer.
   */
  public GetUshort(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getUint16(this._offset, true);
    this._offset += 2;
    return value;
  }

  /**
   * @description Get's an unsigned int value from the buffer.
   */
  public GetUint(): number {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getUint32(this._offset, true);
    this._offset += 4;
    return value;
  }

  /**
   * @description Get's an unsigned long value from the buffer.
   */
  public GetUlong(): bigint {
    if (this._dataView === undefined) throw new Error("Data is null! No data to read from!");

    const value = this._dataView.getBigUint64(this._offset, true);
    this._offset += 8;
    return value;
  }

  /**
   * @description Get's a boolean value from the buffer.
   */
  public GetBool(): boolean {
    return this.GetByte() === 1;
  }

  /**
   * @description Get's a string value from the buffer with an optional max value.
   */
  public GetString(maxLength: number = 0): string {
    if (this._dataView === undefined || this._data === undefined)
      throw new Error("Data is null! No data to read from!");

    const num = this.GetUshort();
    if (num === 0) return "";

    const count = num - 1;
    const str =
      maxLength > 0 && UTF8.GetCharCount(this._data, this._offset, count) > maxLength
        ? ""
        : UTF8.GetString(this._data, this._offset, count);
    this._offset += count;
    return str;
  }

  /**
   * @description Get's a byte array from the buffer
   */
  public GetBytes(destination: Uint8Array, length: number) {
    if (this._dataView === undefined || this._data === undefined)
      throw new Error("Data is null! No data to read from!");

    destination.set(this._data.slice(this._offset, this._offset + length));
    this._offset += length;
  }
}
