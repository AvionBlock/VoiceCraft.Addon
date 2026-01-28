import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../../Data/NetDataReader";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityServerMuteUpdatedPacket implements IMcApiPacket {
    constructor(id?: number, value?: boolean);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): boolean;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: boolean): McApiOnEntityServerMuteUpdatedPacket;
}
