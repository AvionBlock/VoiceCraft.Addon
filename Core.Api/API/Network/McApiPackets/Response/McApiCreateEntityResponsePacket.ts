import {McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {MaxStringLength} from "../../../Data/Constants";
import {IMcApiRIdPacket} from "../IMcApiRIdPacket";

export class McApiCreateEntityResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId: string = "", responseCode: ResponseCodes = ResponseCodes.Ok, id: number = 0) {
        this._requestId = requestId;
        this._responseCode = responseCode;
        this._id = id;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.CreateEntityResponse;
    }

    public get RequestId(): string {
        return this._requestId;
    }

    public get ResponseCode(): ResponseCodes {
        return this._responseCode;
    }

    public get Id(): number {
        return this._id;
    }

    private _requestId: string;
    private _responseCode: ResponseCodes;
    private _id: number;

    public Serialize(writer: NetDataWriter) {
        writer.PutString(this.RequestId, MaxStringLength);
        writer.PutSbyte(this.ResponseCode);
        writer.PutInt(this._id);
    }

    public Deserialize(reader: NetDataReader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._responseCode = reader.GetSbyte() as ResponseCodes;
        this._id = reader.GetInt();
    }

    public Set(requestId: string = "", responseCode: ResponseCodes = ResponseCodes.Ok, id: number = 0): McApiCreateEntityResponsePacket {
        this._requestId = requestId;
        this._responseCode = responseCode;
        this._id = id;
        return this;
    }
}

export enum ResponseCodes {
    Ok = 0,
    Failure = -1
}