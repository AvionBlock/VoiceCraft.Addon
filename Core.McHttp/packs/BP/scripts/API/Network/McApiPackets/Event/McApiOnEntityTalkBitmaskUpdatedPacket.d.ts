import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
export declare class McApiOnEntityTalkBitmaskUpdatedPacket implements IMcApiEventPacket {
    constructor(id?: number, value?: number);
    get EventType(): EventType;
    get Id(): number;
    get Value(): number;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: number): void;
}
