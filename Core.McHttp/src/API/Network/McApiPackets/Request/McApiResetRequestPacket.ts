import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
import {IMcApiRIdPacket} from "../IMcApiRIdPacket";
import {MaxStringLength} from "../../../Data/Constants";

export class McApiResetRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId: string = "") {
        this._requestId = requestId;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.ResetRequest;
    }
    public get RequestId(): string {
        return this._requestId;
    }

    private _requestId: string;

    public Serialize(writer: NetDataWriter) {
        writer.PutString(this._requestId, MaxStringLength);
    }

    public Deserialize(reader: NetDataReader) {
        this._requestId = reader.GetString(MaxStringLength);
    }

    public Set(requestId: string = ""): McApiResetRequestPacket {
        this._requestId = requestId;
        return this;
    }
}
