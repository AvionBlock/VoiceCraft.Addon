import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { Vector3 } from "../../../Data/Vector3";
export declare class McApiSetEntityPositionRequestPacket implements IMcApiPacket {
    constructor(token?: string, id?: number, value?: Vector3);
    get PacketType(): McApiPacketType;
    get Token(): string;
    get Id(): number;
    get Value(): Vector3;
    private _token;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(token?: string, id?: number, value?: Vector3): McApiSetEntityPositionRequestPacket;
}
