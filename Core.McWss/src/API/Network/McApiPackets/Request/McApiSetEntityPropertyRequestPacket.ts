import {McApiPacketType, PropertyType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {MaxStringLength} from "../../../Data/Constants";
import {IMcApiPacket} from "../IMcApiPacket";

export class McApiSetEntityPropertyRequestPacket implements IMcApiPacket {
    constructor(id: number = 0, key: string = "", valueType: PropertyType = PropertyType.Null, value?: boolean | number | bigint) {
        this._id = id;
        this._key = key;
        this._valueType = valueType;
        this._value = value;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.SetEntityPropertyRequest;
    }

    public get Id(): number {
        return this._id;
    }

    public get Key(): string {
        return this._key;
    }

    public get ValueType(): PropertyType {
        return this._valueType;
    }

    public get Value(): boolean | number | bigint | undefined {
        return this._value;
    }

    private _id: number;
    private _key: string;
    private _valueType: PropertyType;
    private _value: boolean | number | bigint | undefined;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutString(this._key, MaxStringLength);
        switch (this._valueType) {
            case PropertyType.Boolean:
                writer.PutByte(this._valueType);
                writer.PutBool(this._value as boolean);
                break;
            case PropertyType.SByte:
                writer.PutByte(this._valueType);
                writer.PutSbyte(this._value as number);
                break;
            case PropertyType.Byte:
                writer.PutByte(this._valueType);
                writer.PutByte(this._value as number);
                break;
            case PropertyType.Short:
                writer.PutByte(this._valueType);
                writer.PutShort(this._value as number);
                break;
            case PropertyType.UShort:
                writer.PutByte(this._valueType);
                writer.PutUshort(this._value as number);
                break;
            case PropertyType.Int:
                writer.PutByte(this._valueType);
                writer.PutInt(this._value as number);
                break;
            case PropertyType.UInt:
                writer.PutByte(this._valueType);
                writer.PutUint(this._value as number);
                break;
            case PropertyType.Long:
                writer.PutByte(this._valueType);
                writer.PutLong(this._value as bigint);
                break;
            case PropertyType.ULong:
                writer.PutByte(this._valueType);
                writer.PutUlong(this._value as bigint);
                break;
            case PropertyType.Float:
                writer.PutByte(this._valueType);
                writer.PutFloat(this._value as number);
                break;
            case PropertyType.Double:
                writer.PutByte(this._valueType);
                writer.PutDouble(this._value as number);
                break;
            case PropertyType.Null:
            default:
                writer.PutByte(PropertyType.Null);
                break;
        }
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._key = reader.GetString(MaxStringLength);
        this._valueType = reader.GetByte() as PropertyType;
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

    public Set(id: number = 0, key: string = "", valueType: PropertyType = PropertyType.Null, value?: boolean | number | bigint) {
        this._id = id;
        this._key = key;
        this._valueType = valueType;
        this._value = value;
    }
}