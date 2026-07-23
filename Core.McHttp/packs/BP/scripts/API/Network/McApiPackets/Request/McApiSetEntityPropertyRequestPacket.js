import { McApiPacketType, PropertyType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiSetEntityPropertyRequestPacket {
    constructor(id = 0, key = "", valueType = PropertyType.Null, value) {
        this._id = id;
        this._key = key;
        this._valueType = valueType;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetEntityPropertyRequest;
    }
    get Id() {
        return this._id;
    }
    get Key() {
        return this._key;
    }
    get ValueType() {
        return this._valueType;
    }
    get Value() {
        return this._value;
    }
    _id;
    _key;
    _valueType;
    _value;
    Serialize(writer) {
        writer.PutInt(this._id);
        writer.PutString(this._key, MaxStringLength);
        switch (this._valueType) {
            case PropertyType.Boolean:
                writer.PutByte(this._valueType);
                writer.PutBool(this._value);
                break;
            case PropertyType.SByte:
                writer.PutByte(this._valueType);
                writer.PutSbyte(this._value);
                break;
            case PropertyType.Byte:
                writer.PutByte(this._valueType);
                writer.PutByte(this._value);
                break;
            case PropertyType.Short:
                writer.PutByte(this._valueType);
                writer.PutShort(this._value);
                break;
            case PropertyType.UShort:
                writer.PutByte(this._valueType);
                writer.PutUshort(this._value);
                break;
            case PropertyType.Int:
                writer.PutByte(this._valueType);
                writer.PutInt(this._value);
                break;
            case PropertyType.UInt:
                writer.PutByte(this._valueType);
                writer.PutUint(this._value);
                break;
            case PropertyType.Long:
                writer.PutByte(this._valueType);
                writer.PutLong(this._value);
                break;
            case PropertyType.ULong:
                writer.PutByte(this._valueType);
                writer.PutUlong(this._value);
                break;
            case PropertyType.Float:
                writer.PutByte(this._valueType);
                writer.PutFloat(this._value);
                break;
            case PropertyType.Double:
                writer.PutByte(this._valueType);
                writer.PutDouble(this._value);
                break;
            case PropertyType.Null:
            default:
                writer.PutByte(PropertyType.Null);
                break;
        }
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._key = reader.GetString(MaxStringLength);
        this._valueType = reader.GetByte();
        switch (this._valueType) {
            case PropertyType.Boolean:
                this._value = reader.GetBool();
                break;
            case PropertyType.SByte:
                this._value = reader.GetSbyte();
                break;
            case PropertyType.Byte:
                this._value = reader.GetByte();
                break;
            case PropertyType.Short:
                this._value = reader.GetShort();
                break;
            case PropertyType.UShort:
                this._value = reader.GetUshort();
                break;
            case PropertyType.Int:
                this._value = reader.GetInt();
                break;
            case PropertyType.UInt:
                this._value = reader.GetUint();
                break;
            case PropertyType.Long:
                this._value = reader.GetLong();
                break;
            case PropertyType.ULong:
                this._value = reader.GetUlong();
                break;
            case PropertyType.Float:
                this._value = reader.GetFloat();
                break;
            case PropertyType.Double:
                this._value = reader.GetDouble();
                break;
            case PropertyType.Null:
            default:
                this._value = undefined;
                break;
        }
    }
    Set(id = 0, key = "", valueType = PropertyType.Null, value) {
        this._id = id;
        this._key = key;
        this._valueType = valueType;
        this._value = value;
    }
}
