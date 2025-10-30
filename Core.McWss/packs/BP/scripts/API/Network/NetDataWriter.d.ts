export declare class NetDataWriter {
    /**
     * @description Contains the raw buffer data the writer holds.
     */
    get Data(): Uint8Array;
    /**
     * @description Contains the total length of the data that was written.
     */
    get Length(): number;
    /**
     * @description Determines whether the internal buffer should automatically resize when inputting new data.
     */
    AutoResize: boolean;
    private _data;
    private _offset;
    private _dataView;
    constructor(buffer?: Uint8Array);
    /**
     * @description Resizes the internal buffer to the new size if required.
     */
    ResizeIfNeeded(newSize: number): void;
    /**
     * @description Resets the writer.
     */
    Reset(): void;
    /**
     * @description Writes a float value into the buffer.
     */
    PutFloat(value: number): void;
    /**
     * @description Writes a double value into the buffer.
     */
    PutDouble(value: number): void;
    /**
     * @description Writes a signed byte value into the buffer.
     */
    PutSbyte(value: number): void;
    /**
     * @description Writes a short value into the buffer.
     */
    PutShort(value: number): void;
    /**
     * @description Writes an int value into the buffer.
     */
    PutInt(value: number): void;
    /**
     * @description Writes a long value into the buffer.
     */
    PutLong(value: bigint): void;
    /**
     * @description Writes a byte value into the buffer.
     */
    PutByte(value: number): void;
    /**
     * @description Writes an unsigned short value into the buffer.
     */
    PutUshort(value: number): void;
    /**
     * @description Writes an unsigned int value into the buffer.
     */
    PutUint(value: number): void;
    /**
     * @description Writes an unsigned long value into the buffer.
     */
    PutUlong(value: bigint): void;
    /**
     * @description Writes a boolean value into the buffer.
     */
    PutBool(value: boolean): void;
    /**
     * @description Writes string value into the buffer.
     */
    PutString(value: string, maxLength?: number): void;
    /**
     * @description Writes byte values into the buffer
     */
    PutBytes(value: Uint8Array, offset: number, length: number): void;
}
