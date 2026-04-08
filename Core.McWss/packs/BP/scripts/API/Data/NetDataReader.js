import { NetDataWriter } from "./NetDataWriter";
import { UTF8 } from "../Encoders/UTF8";
export class NetDataReader {
    /**
     * @description Contains the raw buffer data the the reader is set to.
     */
    get Data() {
        return this._data;
    }
    /**
     * @description Contains the length of the buffer when set, not the raw data length.
     */
    get Length() {
        return this._dataSize;
    }
    /**
     * @description Contains the offset in the raw data it is reading from.
     */
    get Offset() {
        return this._offset;
    }
    /**
     * @description Determines whether the buffer source has not been set.
     */
    get IsNull() {
        return this._data === undefined;
    }
    /**
     * @description Determines whether the buffer has been fully read.
     */
    get EndOfData() {
        return this._offset === this._dataSize;
    }
    /**
     * @description Calculates how many bytes are left to read.
     */
    get AvailableBytes() {
        return this._dataSize - this._offset;
    }
    _data;
    _dataSize = 0;
    _offset = 0;
    _dataView;
    /**
     * @description Creates a new reader.
     */
    constructor(buffer) {
        if (buffer instanceof NetDataWriter)
            this.SetWriterSource(buffer);
        else if (buffer instanceof Uint8Array)
            this.SetBufferSource(buffer);
    }
    /**
     * @description Sets the reader's source.
     */
    SetWriterSource(writer) {
        this._data = writer.Data;
        this._offset = 0;
        this._dataSize = writer.Length;
        this._dataView = new DataView(this._data.buffer);
    }
    /**
     * @description Sets the reader's source.
     */
    SetBufferSource(buffer) {
        this._data = buffer;
        this._offset = 0;
        this._dataSize = buffer.length;
        this._dataView = new DataView(this._data.buffer);
    }
    /**
     * @description Clear's the reader's source. Does not overwrite or reset the original source.
     */
    Clear() {
        this._offset = 0;
        this._dataSize = 0;
        this._data = undefined;
    }
    /**
     * @description Copies the data into a new Uint8Array
     * @returns The copied data.
     */
    CopyData() {
        if (this._data === undefined)
            throw new Error("No data to copy!");
        const dst = new Uint8Array(this._dataSize);
        dst.set(this._data.subarray(0, this._dataSize));
        return dst;
    }
    /**
     * @description Skips a certain amount of bytes.
     * @param count The number of bytes to skip.
     */
    SkipBytes(count) {
        this._offset += count;
    }
    /**
     * @description Get's a float value from the buffer.
     */
    GetFloat() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getFloat32(this._offset, true);
        this._offset += 4;
        return value;
    }
    /**
     * @description Get's a double value from the buffer.
     */
    GetDouble() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getFloat64(this._offset, true);
        this._offset += 8;
        return value;
    }
    /**
     * @description Get's a signed byte value from the buffer.
     */
    GetSbyte() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getInt8(this._offset);
        this._offset += 1;
        return value;
    }
    /**
     * @description Get's a short value from the buffer.
     */
    GetShort() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getInt16(this._offset, true);
        this._offset += 2;
        return value;
    }
    /**
     * @description Get's an int value from the buffer.
     */
    GetInt() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getInt32(this._offset, true);
        this._offset += 4;
        return value;
    }
    /**
     * @description Get's a long value from the buffer.
     */
    GetLong() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getBigInt64(this._offset, true);
        this._offset += 8;
        return value;
    }
    /**
     * @description Get's a byte value from the buffer.
     */
    GetByte() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getUint8(this._offset);
        this._offset += 1;
        return value;
    }
    /**
     * @description Get's an unsigned short value from the buffer.
     */
    GetUshort() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getUint16(this._offset, true);
        this._offset += 2;
        return value;
    }
    /**
     * @description Get's an unsigned int value from the buffer.
     */
    GetUint() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getUint32(this._offset, true);
        this._offset += 4;
        return value;
    }
    /**
     * @description Get's an unsigned long value from the buffer.
     */
    GetUlong() {
        if (this._dataView === undefined)
            throw new Error("Data is null! No data to read from!");
        const value = this._dataView.getBigUint64(this._offset, true);
        this._offset += 8;
        return value;
    }
    /**
     * @description Get's a boolean value from the buffer.
     */
    GetBool() {
        return this.GetByte() === 1;
    }
    /**
     * @description Get's a string value from the buffer with an optional max value.
     */
    GetString(maxLength = 0) {
        if (this._dataView === undefined || this._data === undefined)
            throw new Error("Data is null! No data to read from!");
        const num = this.GetUshort();
        if (num === 0)
            return "";
        const count = num - 1;
        const str = maxLength > 0 && UTF8.GetCharCount(this._data, this._offset, count) > maxLength
            ? ""
            : UTF8.GetString(this._data, this._offset, count);
        this._offset += count;
        return str;
    }
    /**
     * @description Get's a byte array from the buffer
     */
    GetBytes(destination, length) {
        if (this._dataView === undefined || this._data === undefined)
            throw new Error("Data is null! No data to read from!");
        destination.set(this._data.subarray(this._offset, this._offset + length));
        this._offset += length;
    }
}
