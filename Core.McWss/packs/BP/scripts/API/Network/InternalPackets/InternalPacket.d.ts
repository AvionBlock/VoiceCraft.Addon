import { InternalPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
export declare abstract class InternalPacket implements INetSerializable {
    constructor(requestId?: string);
    get RequestId(): string | undefined;
    abstract get PacketType(): InternalPacketType;
    private _requestId?;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
