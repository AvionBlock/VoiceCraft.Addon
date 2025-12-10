import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { Vector2 } from "../../../Data/Vector2";
export declare class McApiSetEntityRotationRequestPacket implements IMcApiPacket {
    constructor(token?: string, id?: number, value?: Vector2);
    get PacketType(): McApiPacketType;
    get Token(): string;
    get Id(): number;
    get Value(): Vector2;
    private _token;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(token?: string, id?: number, value?: Vector2): McApiSetEntityRotationRequestPacket;
}
