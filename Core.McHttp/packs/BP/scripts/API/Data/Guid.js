//Credits https://github.com/snico-dev/guid-typescript/blob/master/lib/guid.ts
export class Guid {
    static validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    static EMPTY = "00000000-0000-0000-0000-000000000000";
    static IsGuid(guid) {
        const value = guid.toString();
        return guid && (guid instanceof Guid || Guid.validator.test(value));
    }
    static Create() {
        return new Guid([Guid.Gen(2), Guid.Gen(1), Guid.Gen(1), Guid.Gen(1), Guid.Gen(3)].join("-"));
    }
    static CreateEmpty() {
        return new Guid("emptyguid");
    }
    static Parse(guid) {
        return new Guid(guid);
    }
    static Raw() {
        return [Guid.Gen(2), Guid.Gen(1), Guid.Gen(1), Guid.Gen(1), Guid.Gen(3)].join("-");
    }
    static Gen(count) {
        let out = "";
        for (let i = 0; i < count; i++) {
            // tslint:disable-next-line:no-bitwise
            out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return out;
    }
    value;
    constructor(guid) {
        if (!guid) {
            throw new TypeError("Invalid argument; `value` has no value.");
        }
        this.value = Guid.EMPTY;
        if (guid && Guid.IsGuid(guid)) {
            this.value = guid;
        }
    }
    Equals(other) {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.IsGuid(other) && this.value === other.toString();
    }
    IsEmpty() {
        return this.value === Guid.EMPTY;
    }
    toString() {
        return this.value;
    }
}
