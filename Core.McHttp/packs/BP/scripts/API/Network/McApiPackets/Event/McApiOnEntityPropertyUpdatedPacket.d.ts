import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType, PropertyType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
export declare class McApiOnEntityPropertyUpdatedPacket implements IMcApiEventPacket {
    constructor(id?: number, key?: string, valueType?: PropertyType, value?: boolean | number | bigint);
    get EventType(): EventType;
    get Id(): number;
    get Key(): string;
    get ValueType(): PropertyType;
    get Value(): boolean | number | bigint | undefined;
    private _id;
    private _key;
    private _valueType;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, key?: string, valueType?: PropertyType, value?: boolean | number | bigint): void;
}
