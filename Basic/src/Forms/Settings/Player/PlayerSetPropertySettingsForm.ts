import {ModalFormData} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {PropertyType} from "../../../API/Data/Enums";
import {McApiSetEntityPropertyRequestPacket} from "../../../API/Network/McApiPackets/Request/McApiSetEntityPropertyRequestPacket";
import {VoiceCraft} from "../../../API/VoiceCraft";

export class PlayerSetPropertySettingsForm {
    constructor(private _vc: VoiceCraft) {
    }

    private _form = (player: Player) => new ModalFormData()
        .title(`Set Property: ${player.name}`)
        .textField("Property", "ProximityEffect:MaxRange")
        .dropdown("Property Type", Object.keys(PropertyType).filter((item) => {
            return isNaN(Number(item));
        }))
        .textField("Value", "0.0")

    public async Show(player: Player, entityId: number) {
        const form = this._form(player);
        const {cancelationReason, formValues} = await form.show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [property, propertyType, value] = this.Validate(formValues);
        this._vc.SendPacket(new McApiSetEntityPropertyRequestPacket(entityId, property, propertyType, value));
    }

    private Validate(formValues: (string | number | boolean | undefined)[]): [string, PropertyType, (boolean | number | bigint | undefined)] {
        //Extract Values
        const [propertyValue, propertyTypeValue, valueValue] = formValues;

        //Validate Values
        if (typeof propertyValue !== "string" ||
            typeof propertyTypeValue !== "number" ||
            typeof valueValue !== "string"
        )
            throw new Error("Invalid Form Values!");

        let value: boolean | number | bigint | undefined;
        switch (propertyTypeValue) {
            case PropertyType.Boolean:
                value = Boolean(valueValue);
                break;
            case PropertyType.SByte:
                value = Number.parseInt(valueValue);
                if (value > 127 || value < -128)
                    throw new Error("Invalid SByte Value!");
                break;
            case PropertyType.Byte:
                value = Number.parseInt(valueValue);
                if (value > 255 || value < 0)
                    throw new Error("Invalid Byte Value!");
                break;
            case PropertyType.Short:
                value = Number.parseInt(valueValue);
                if (value > 32767 || value < -32768)
                    throw new Error("Invalid Short Value!");
                break;
            case PropertyType.UShort:
                value = Number.parseInt(valueValue);
                if (value > 65535 || value < 0)
                    throw new Error("Invalid UShort Value!");
                break;
            case PropertyType.Int:
                value = Number.parseInt(valueValue);
                if (value > 2147483647 || value < -2147483648)
                    throw new Error("Invalid Int Value!");
                break;
            case PropertyType.UInt:
                value = Number.parseInt(valueValue);
                if (value > 4294967295 || value < 0)
                    throw new Error("Invalid UInt Value!");
                break;
            case PropertyType.Long:
                value = Number.parseInt(valueValue);
                if (value > 9223372036854775807n || value < -9223372036854775808n)
                    throw new Error("Invalid Long Value!");
                break;
            case PropertyType.ULong:
                value = Number.parseInt(valueValue);
                if (value > 18446744073709551615n || value < 0)
                    throw new Error("Invalid Long Value!");
                break;
            case PropertyType.Float:
                value = Number.parseFloat(valueValue);
                break;
            case PropertyType.Double:
                value = BigInt(valueValue);
                break;
            case PropertyType.Null:
            default:
                return [propertyValue, PropertyType.Null, undefined];
        }
        //Return Values
        return [propertyValue, propertyTypeValue, value];
    }
}