import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
export declare class McApiSetEntityDeafenRequestPacket implements IMcApiPacket {
    constructor(id?: number, value?: boolean);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): boolean;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: boolean): McApiSetEntityDeafenRequestPacket;
}
