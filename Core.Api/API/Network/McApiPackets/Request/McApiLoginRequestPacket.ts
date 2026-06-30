import {EventType, McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {MaxStringLength} from "../../../Data/Constants";
import {IMcApiRIdPacket} from "../IMcApiRIdPacket";
import {Version} from "../../../Data/Version";

export class McApiLoginRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId: string = "", token: string = "", version: Version = new Version(0, 0, 0), subscribeEvents: EventType[] = []) {
        this._requestId = requestId;
        this._token = token;
        this._version = version;
        this._subscribeEvents = subscribeEvents;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.LoginRequest;
    }

    public get RequestId(): string {
        return this._requestId;
    }

    public get Token(): string {
        return this._token;
    }

    public get Version(): Version {
        return this._version;
    }

    public get SubscribeEvents(): EventType[] {
        return this._subscribeEvents;
    }

    private _requestId: string;
    private _token: string;
    private _version: Version;
    private _subscribeEvents: EventType[];

    public Serialize(writer: NetDataWriter) {
        writer.PutString(this._requestId, MaxStringLength);
        writer.PutString(this._token, MaxStringLength);
        writer.PutInt(this._version.Major);
        writer.PutInt(this._version.Minor);
        writer.PutInt(this._version.Build);
        writer.PutInt(this._subscribeEvents.length);
        for (const event of this._subscribeEvents) {
            writer.PutByte(event);
        }
    }

    public Deserialize(reader: NetDataReader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._token = reader.GetString(MaxStringLength);
        this._version = new Version(reader.GetInt(), reader.GetInt(), reader.GetInt());
        //Backwards Compatibility, We leave as empty array since the version will be invalid anyway.
        if (reader.EndOfData) {
            this._subscribeEvents = [];
            return;
        }

        const eventsLength = reader.GetInt();
        const events = [];
        for (let i = 0; i < eventsLength; i++) {
            const event = reader.GetByte() as EventType;
            if (event > 0 && event <= EventType.OnEntityAudioDataReceived) {
                events.push(event);
            }
        }

        this._subscribeEvents = events;
    }

    public Set(requestId: string = "", token: string = "", version: Version = new Version(0, 0, 0), subscribeEvents: EventType[] = []) {
        this._requestId = requestId;
        this._token = token;
        this._version = version;
        this._subscribeEvents = subscribeEvents;
    }
}
