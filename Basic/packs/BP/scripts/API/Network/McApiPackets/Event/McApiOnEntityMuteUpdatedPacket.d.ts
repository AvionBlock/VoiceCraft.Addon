import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
export declare class McApiOnEntityMuteUpdatedPacket implements IMcApiEventPacket {
    constructor(id?: number, value?: boolean);
    get EventType(): EventType;
    get Id(): number;
    get Value(): boolean;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: boolean): void;
}
