export declare class Z85 {
    private static _base85;
    private static _encodingTable;
    private static _decodingTable;
    static GetStringWithPadding(data: Uint8Array): string;
    static GetString(data: Uint8Array): string;
    static GetBytesWithPadding(data: string): Uint8Array;
    static GetBytes(data: string): Uint8Array;
}
