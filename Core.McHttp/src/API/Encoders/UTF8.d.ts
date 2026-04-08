export declare class UTF8 {
    constructor();
    /**
     * @description Encodes a string into a Uint8Array.
     */
    static GetBytes(s: string): Uint8Array | undefined;
    /**
     * @description Encodes a range of characters from a string into a Uint8Array.
     */
    static SetBytes(s: string, charIndex: number, charCount: number, bytes: Uint8Array, byteIndex: number): number;
    /**
     * @description Decodes a range of bytes from a Uint8Array into a string.
     */
    static GetString(bytes: Uint8Array, index: number, count: number): string;
    /**
     * @description Calculates the exact number of bytes required to encode the string.
     */
    static GetByteCount(chars: string): number;
    /**
     * @description Calculates the exact number characters encoded into the byte array.
     */
    static GetCharCount(bytes: Uint8Array, index: number, count: number): number;
    /**
     * @description Calculates the maximum number of bytes produced by encoding the specified number of characters.
     */
    static GetMaxByteCount(charCount: number): number;
    /**
     * @description Calculates the required numbers of bytes to encode the specified char code.
     */
    static GetByteCountFromCharCode(charCode: number): number | undefined;
    /**
     * @description Get's a Uint8Array with the encoded bytes for the specified charcode.
     */
    static GetBytesFromCharCode(charCode: number): Uint8Array | undefined;
    /**
     * @description Sets a Uint8Array with the encoded bytes for the specified charcode.
     */
    static SetBytesFromCharCode(charCode: number, bytes: Uint8Array, index: number): number | undefined;
    /**
     * @description Get's a charcode from the specified Uint8Array at index.
     */
    static GetCharCodeFromBytes(bytes: Uint8Array, index: number): number | undefined;
}
