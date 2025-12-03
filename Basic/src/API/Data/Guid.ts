//Credits https://github.com/snico-dev/guid-typescript/blob/master/lib/guid.ts

export class Guid {

    public static validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

    public static EMPTY = "00000000-0000-0000-0000-000000000000";

    public static IsGuid(guid: any) {
        const value: string = guid.toString();
        return guid && (guid instanceof Guid || Guid.validator.test(value));
    }

    public static Create(): Guid {
        return new Guid([Guid.Gen(2), Guid.Gen(1), Guid.Gen(1), Guid.Gen(1), Guid.Gen(3)].join("-"));
    }

    public static CreateEmpty(): Guid {
        return new Guid("emptyguid");
    }

    public static Parse(guid: string): Guid {
        return new Guid(guid);
    }

    public static Raw(): string {
        return [Guid.Gen(2), Guid.Gen(1), Guid.Gen(1), Guid.Gen(1), Guid.Gen(3)].join("-");
    }

    private static Gen(count: number) {
        let out: string = "";
        for (let i: number = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    }

    private value: string;

    private constructor(guid: string) {
        if (!guid) { throw new TypeError("Invalid argument; `value` has no value."); }

        this.value = Guid.EMPTY;

        if (guid && Guid.IsGuid(guid)) {
            this.value = guid;
        }
    }

    public Equals(other: Guid): boolean {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.IsGuid(other) && this.value === other.toString();
    }

    public IsEmpty(): boolean {
        return this.value === Guid.EMPTY;
    }

    public toString(): string {
        return this.value;
    }
}