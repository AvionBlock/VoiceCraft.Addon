import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxStringLength } from "../../../Data/Constants";

export class McApiClearEffectsRequestPacket implements IMcApiPacket {
    constructor(token: string = "") {
        this._token = token;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.ClearEffectsRequest;
    }
    public get Token(): string {
        return this._token;
    }

    private _token: string;

    public Serialize(writer: NetDataWriter) {
        writer.PutString(this._token, MaxStringLength);
    }

    public Deserialize(reader: NetDataReader) {
        this._token = reader.GetString(MaxStringLength);
    }

    public Set(token: string = ""): McApiClearEffectsRequestPacket {
        this._token = token;
        return this;
    }
}
