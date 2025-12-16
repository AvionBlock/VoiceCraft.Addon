export declare class Z85 {
    private static readonly Base85;
    private static readonly EncodingTable;
    private static readonly DecodingTable;
    static GetPaddedEncodeSize(size: number): number;
    static GetEncodeSize(size: number): number;
    static GetStringWithPadding(data: Uint8Array): string;
    static GetString(data: Uint8Array): string;
    static GetBytesWithPadding(data: string): Uint8Array<ArrayBuffer>;
    static GetBytes(data: string): Uint8Array<ArrayBuffer>;
}
