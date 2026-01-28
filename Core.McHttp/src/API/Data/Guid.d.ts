export declare class Guid {
    static validator: RegExp;
    static EMPTY: string;
    static IsGuid(guid: any): any;
    static Create(): Guid;
    static CreateEmpty(): Guid;
    static Parse(guid: string): Guid;
    static Raw(): string;
    private static Gen;
    private value;
    private constructor();
    Equals(other: Guid): boolean;
    IsEmpty(): boolean;
    toString(): string;
}
