import { McApiPacketType } from "../../../Data/Enums";
import { Vector2 } from "../../../Data/Vector2";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityRotationUpdatedPacket implements IMcApiPacket {
    constructor(id?: number, value?: Vector2);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): Vector2;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: Vector2): McApiOnEntityRotationUpdatedPacket;
}
