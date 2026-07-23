import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
export declare class McApiOnEntityVisibilityUpdatedPacket implements IMcApiEventPacket {
    constructor(id?: number, id2?: number, value?: boolean);
    get EventType(): EventType;
    get Id(): number;
    get Id2(): number;
    get Value(): boolean;
    private _id;
    private _id2;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, id2?: number, value?: boolean): void;
}
