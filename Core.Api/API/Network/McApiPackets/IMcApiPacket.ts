import { McApiPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";

export interface IMcApiPacket extends INetSerializable {
    get PacketType(): McApiPacketType;
}
