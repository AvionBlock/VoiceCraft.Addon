import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { Vector2 } from "../../Data/Vector2";
export declare class McApiSetRotationPacket extends McApiPacket {
    constructor(id?: number, value?: Vector2);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): Vector2;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
