import { ModalFormData } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
export class AutoConnectSettingsForm {
    _autoConnectMenuSettingsForm = (ip, port, loginKey, startup, reconnect) => new ModalFormData()
        .title("Auto Connect")
        .textField("IP", "127.0.0.1", { defaultValue: ip })
        .textField("Port", "9050", { defaultValue: port.toString() })
        .textField("Login Key", "00000000-0000-0000-0000-000000000000", { defaultValue: loginKey })
        .toggle("Connect On Startup", { defaultValue: startup })
        .toggle("Auto Reconnect", { defaultValue: reconnect });
    async Show(player) {
        const form = this._autoConnectMenuSettingsForm(world.getDynamicProperty("autoConnect:ip") ?? "", world.getDynamicProperty("autoConnect:port") ?? 0, world.getDynamicProperty("autoConnect:loginKey") ?? "", world.getDynamicProperty("autoConnect:startup") ?? false, world.getDynamicProperty("autoConnect:reconnect") ?? false);
        const { canceled, formValues } = await form.show(player);
        if (canceled || formValues === undefined)
            return;
        const [ip, port, loginKey, startup, reconnect] = this.Validate(formValues);
        world.setDynamicProperty("autoConnect:ip", ip);
        world.setDynamicProperty("autoConnect:port", port);
        world.setDynamicProperty("autoConnect:loginKey", loginKey);
        world.setDynamicProperty("autoConnect:startup", startup);
        world.setDynamicProperty("autoConnect:reconnect", reconnect);
    }
    Validate(formValues) {
        //Extract Values
        const [ipValue, portValue, loginKeyValue, startupValue, reconnectValue] = formValues;
        //Validate Values
        if (typeof ipValue !== "string" ||
            typeof portValue !== "string" ||
            typeof loginKeyValue !== "string" ||
            typeof startupValue !== "boolean" ||
            typeof reconnectValue !== "boolean")
            throw new Error("Invalid Form Values!");
        const port = Number.parseInt(portValue);
        if (port < 1 || port > 65535)
            throw new Error("Invalid Port!");
        //Return Values
        return [ipValue, port, loginKeyValue, startupValue, reconnectValue];
    }
}
