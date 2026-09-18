import {
    CustomForm, DropdownItemData,
    ObservableNumber,
    ObservableString
} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {PropertyType} from "../../../API/Data/Enums";
import {VoiceCraft} from "../../../API/VoiceCraft";
import {
    McApiSetEntityPropertyRequestPacket
} from "../../../API/Network/McApiPackets/Request/McApiSetEntityPropertyRequestPacket";

export class PlayerSetPropertySettingsForm {
    private readonly _form: CustomForm;

    //Broadcasts
    private _propertyType = new ObservableNumber(0, {clientWritable: true});
    private _property = new ObservableString("", {clientWritable: true});
    private _value = new ObservableString("", {clientWritable: true});

    constructor(private _player: Player, private _vc: VoiceCraft, entityId: number) {
        const propertyTypes: DropdownItemData[] = [];
        for (const propertyType of Object.keys(PropertyType).filter(x => isNaN(Number(x))).entries()) {
            propertyTypes.push({label: propertyType[1], value: propertyType[0]});
        }

        this._form = new CustomForm(this._player, "Set Property")
            .spacer()
            .dropdown("Property Type", this._propertyType, propertyTypes)
            .textField("Property", this._property)
            .textField("Value", this._value)
            .spacer()
            .button("Save", () => this.Save(entityId))
            .closeButton();
    }

    public async ShowAsync() {
        try {
            await this._form.show();
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }

    private Save(entityId: number) {
        try {
            const [propertyType, property, value] = this.GetData();
            this._vc.SendPacket(new McApiSetEntityPropertyRequestPacket(entityId, property, propertyType, value));
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        } finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }

    private GetData(): [PropertyType, string, (boolean | number | bigint | undefined)] {
        const propertyType = this._propertyType.getData();
        const property = this._property.getData();
        let value: boolean | number | bigint | undefined;
        switch (propertyType) {
            case PropertyType.Boolean:
                value = Boolean(this._value.getData());
                break;
            case PropertyType.SByte:
                value = Number.parseInt(this._value.getData());
                if (value > 127 || value < -128)
                    throw new Error("Invalid SByte Value!");
                break;
            case PropertyType.Byte:
                value = Number.parseInt(this._value.getData());
                if (value > 255 || value < 0)
                    throw new Error("Invalid Byte Value!");
                break;
            case PropertyType.Short:
                value = Number.parseInt(this._value.getData());
                if (value > 32767 || value < -32768)
                    throw new Error("Invalid Short Value!");
                break;
            case PropertyType.UShort:
                value = Number.parseInt(this._value.getData());
                if (value > 65535 || value < 0)
                    throw new Error("Invalid UShort Value!");
                break;
            case PropertyType.Int:
                value = Number.parseInt(this._value.getData());
                if (value > 2147483647 || value < -2147483648)
                    throw new Error("Invalid Int Value!");
                break;
            case PropertyType.UInt:
                value = Number.parseInt(this._value.getData());
                if (value > 4294967295 || value < 0)
                    throw new Error("Invalid UInt Value!");
                break;
            case PropertyType.Long:
                value = Number.parseInt(this._value.getData());
                if (value > 9223372036854775807n || value < -9223372036854775808n)
                    throw new Error("Invalid Long Value!");
                break;
            case PropertyType.ULong:
                value = Number.parseInt(this._value.getData());
                if (value > 18446744073709551615n || value < 0)
                    throw new Error("Invalid Long Value!");
                break;
            case PropertyType.Float:
                value = Number.parseFloat(this._value.getData());
                break;
            case PropertyType.Double:
                value = BigInt(this._value.getData());
                break;
            case PropertyType.Null:
            default:
                return [PropertyType.Null, property, undefined];
        }
        //Return Values
        return [propertyType, property, value];
    }
}