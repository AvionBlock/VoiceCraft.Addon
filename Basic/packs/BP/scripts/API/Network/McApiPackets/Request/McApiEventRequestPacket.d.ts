import { EventType, McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
import { IMcApiEventPacket } from "../IMcApiEventPacket";
export declare class McApiEventRequestPacket implements IMcApiPacket {
    constructor(event?: IMcApiEventPacket);
    get PacketType(): McApiPacketType;
    get EventType(): EventType;
    get Event(): IMcApiEventPacket | undefined;
    private _event?;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(event?: IMcApiEventPacket): void;
}
