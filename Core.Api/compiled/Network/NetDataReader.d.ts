import { NetDataWriter } from "./NetDataWriter";
export declare class NetDataReader {
    /**
     * @description Contains the raw buffer data the the reader is set to.
     */
    get Data(): Uint8Array | undefined;
    /**
     * @description Contains the length of the buffer when set, not the raw data length.
     */
    get Length(): number;
    /**
     * @description Contains the offset in the raw data it is reading from.
     */
    get Offset(): number;
    /**
     * @description Determines whether the buffer source has not been set.
     */
    get IsNull(): boolean;
    /**
     * @description Determines whether the buffer has been fully read.
     */
    get EndOfData(): boolean;
    /**
     * @description Calculates how many bytes are left to read.
     */
    get AvailableBytes(): number;
    private _data?;
    private _dataSize;
    private _offset;
    private _dataView?;
    /**
     * @description Creates a new reader.
     */
    constructor(buffer?: NetDataWriter | Uint8Array);
    /**
     * @description Sets the reader's source.
     */
    SetWriterSource(writer: NetDataWriter): void;
    /**
     * @description Sets the reader's source.
     */
    SetBufferSource(buffer: Uint8Array): void;
    /**
     * @description Clear's the reader's source. Does not overwrite or reset the original source.
     */
    Clear(): void;
    /**
     * @description Get's a float value from the buffer.
     */
    GetFloat(): number;
    /**
     * @description Get's a double value from the buffer.
     */
    GetDouble(): number;
    /**
     * @description Get's a signed byte value from the buffer.
     */
    GetSbyte(): number;
    /**
     * @description Get's a short value from the buffer.
     */
    GetShort(): number;
    /**
     * @description Get's an int value from the buffer.
     */
    GetInt(): number;
    /**
     * @description Get's a long value from the buffer.
     */
    GetLong(): bigint;
    /**
     * @description Get's a byte value from the buffer.
     */
    GetByte(): number;
    /**
     * @description Get's an unsigned short value from the buffer.
     */
    GetUshort(): number;
    /**
     * @description Get's an unsigned int value from the buffer.
     */
    GetUint(): number;
    /**
     * @description Get's an unsigned long value from the buffer.
     */
    GetUlong(): bigint;
    /**
     * @description Get's a boolean value from the buffer.
     */
    GetBool(): boolean;
    /**
     * @description Get's a string value from the buffer with an optional max value.
     */
    GetString(maxLength?: number): string;
    /**
     * @description Get's a byte array from the buffer
     */
    GetBytes(destination: Uint8Array, length: number): void;
}
