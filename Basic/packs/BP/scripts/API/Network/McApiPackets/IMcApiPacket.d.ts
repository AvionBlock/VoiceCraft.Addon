import { McApiPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";
export interface IMcApiPacket extends INetSerializable {
    get PacketType(): McApiPacketType;
}
export declare function IsIMcApiPacket(object: any): object is IMcApiPacket;
