import { McApiPacketType } from "../../../Data/Enums";
export class McApiOnEntityServerDeafenUpdatedPacket {
    constructor(id = 0, value = false) {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.OnEntityServerDeafenUpdated;
    }
    get Id() {
        return this._id;
    }
    get Value() {
        return this._value;
    }
    _id;
    _value;
    Serialize(writer) {
        writer.PutInt(this.Id);
        writer.PutBool(this.Value);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetBool();
    }
    Set(id = 0, value = false) {
        this._id = id;
        this._value = value;
        return this;
    }
}
