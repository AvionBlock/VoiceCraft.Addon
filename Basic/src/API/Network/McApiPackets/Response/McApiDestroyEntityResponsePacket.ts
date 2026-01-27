import {McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {MaxStringLength} from "../../../Data/Constants";
import {IMcApiRIdPacket} from "../IMcApiRIdPacket";

export class McApiDestroyEntityResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId: string = "", responseCode: ResponseCodes = ResponseCodes.Ok) {
        this._requestId = requestId;
        this._responseCode = responseCode;
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

    private _requestId: string;
    private _responseCode: ResponseCodes;

    public Serialize(writer: NetDataWriter) {
        writer.PutString(this.RequestId, MaxStringLength);
        writer.PutSbyte(this.ResponseCode);
    }

    public Deserialize(reader: NetDataReader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._responseCode = reader.GetSbyte() as ResponseCodes;
    }

    public Set(requestId: string = "", responseCode: ResponseCodes = ResponseCodes.Ok): McApiDestroyEntityResponsePacket {
        this._requestId = requestId;
        this._responseCode = responseCode;
        return this;
    }
}

export enum ResponseCodes {
    Ok = 0,
    NotFound = -1
}