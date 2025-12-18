import { McApiPacketType } from "../../../Data/Enums";
export class McApiSetEntityCaveFactorRequestPacket {
    constructor(id = 0, value = 0) {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetEntityCaveFactorRequest;
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
        writer.PutInt(this._id);
        writer.PutFloat(this._value);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetFloat();
    }
    Set(id = 0, value = 0) {
        this._id = id;
        this._value = value;
        return this;
    }
}
