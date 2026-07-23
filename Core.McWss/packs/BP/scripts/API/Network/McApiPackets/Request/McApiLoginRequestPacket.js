import { EventType, McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
import { Version } from "../../../Data/Version";
export class McApiLoginRequestPacket {
    constructor(requestId = "", token = "", version = new Version(0, 0, 0), subscribeEvents = []) {
        this._requestId = requestId;
        this._token = token;
        this._version = version;
        this._subscribeEvents = subscribeEvents;
    }
    get PacketType() {
        return McApiPacketType.LoginRequest;
    }
    get RequestId() {
        return this._requestId;
    }
    get Token() {
        return this._token;
    }
    get Version() {
        return this._version;
    }
    get SubscribeEvents() {
        return this._subscribeEvents;
    }
    _requestId;
    _token;
    _version;
    _subscribeEvents;
    Serialize(writer) {
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
    Deserialize(reader) {
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
            const event = reader.GetByte();
            if (event > 0 && event <= EventType.OnEntityAudioDataReceived) {
                events.push(event);
            }
        }
        this._subscribeEvents = events;
    }
    Set(requestId = "", token = "", version = new Version(0, 0, 0), subscribeEvents = []) {
        this._requestId = requestId;
        this._token = token;
        this._version = version;
        this._subscribeEvents = subscribeEvents;
    }
}
