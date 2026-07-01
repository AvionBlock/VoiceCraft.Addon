import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
export declare class McApiOnEntityNameUpdatedPacket implements IMcApiEventPacket {
    constructor(id?: number, value?: string);
    get EventType(): EventType;
    get Id(): number;
    get Value(): string;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: string): void;
}
