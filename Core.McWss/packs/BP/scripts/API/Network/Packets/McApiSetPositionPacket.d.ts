import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { Vector3 } from "../../Data/Vector3";
export declare class McApiSetPositionPacket extends McApiPacket {
    constructor(id?: number, value?: Vector3);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): Vector3;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
