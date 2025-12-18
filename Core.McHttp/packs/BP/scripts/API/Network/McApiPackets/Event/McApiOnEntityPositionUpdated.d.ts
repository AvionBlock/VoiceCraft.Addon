import { McApiPacketType } from "../../../Data/Enums";
import { Vector3 } from "../../../Data/Vector3";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityPositionUpdatedPacket implements IMcApiPacket {
    constructor(id?: number, value?: Vector3);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): Vector3;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: Vector3): McApiOnEntityPositionUpdatedPacket;
}
