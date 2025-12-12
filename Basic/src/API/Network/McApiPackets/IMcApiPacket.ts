import { McApiPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";

export interface IMcApiPacket extends INetSerializable {
    get PacketType(): McApiPacketType;
}

export function IsIMcApiPacket(object: any): object is IMcApiPacket {
    return 'PacketType' in object;
}