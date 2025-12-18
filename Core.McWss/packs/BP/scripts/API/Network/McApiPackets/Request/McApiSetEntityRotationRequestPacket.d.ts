import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { Vector2 } from "../../../Data/Vector2";
export declare class McApiSetEntityRotationRequestPacket implements IMcApiPacket {
    constructor(id?: number, value?: Vector2);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): Vector2;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: Vector2): McApiSetEntityRotationRequestPacket;
}
