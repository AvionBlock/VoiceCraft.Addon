import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../../Data/NetDataReader";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
import {IMcApiRIdPacket} from "../IMcApiRIdPacket";
import {MaxStringLength} from "../../../Data/Constants";

export class McApiDestroyEntityRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId: string = "", id: number = 0) {
        this._requestId = requestId;
        this._id = id;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.DestroyEntityRequest;
    }
    public get RequestId(): string {
        return this._requestId;
    }
    public get Id(): number {
        return this._id;
    }

    private _requestId: string;
    private _id: number;

    public Serialize(writer: NetDataWriter) {
        writer.PutString(this.RequestId, MaxStringLength);
        writer.PutInt(this.Id);
    }

    public Deserialize(reader: NetDataReader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._id = reader.GetInt();
    }

    public Set(requestId: string = "", id: number = 0): McApiDestroyEntityRequestPacket {
        this._requestId = requestId;
        this._id = id;
        return this;
    }
}
