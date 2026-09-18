import { CustomForm, ObservableBoolean, ObservableString } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
export class AutoConnectSettingsForm {
    _player;
    _form;
    //Broadcasts
    Ip = new ObservableString(world.getDynamicProperty("autoConnect:ip")?.toString() ?? "", { clientWritable: true });
    Port = new ObservableString(world.getDynamicProperty("autoConnect:port")?.toString() ?? "9050", { clientWritable: true });
    LoginKey = new ObservableString(world.getDynamicProperty("autoConnect:loginKey")?.toString() ?? "", { clientWritable: true });
    //Behavior
    connectOnStartup = new ObservableBoolean(world.getDynamicProperty("autoConnect:startup") ?? false, { clientWritable: true });
    autoReconnect = new ObservableBoolean(world.getDynamicProperty("autoConnect:reconnect") ?? false, { clientWritable: true });
    constructor(_player) {
        this._player = _player;
        this._form = new CustomForm(this._player, "General Settings")
            .spacer()
            .label("Remote Server")
            .spacer()
            .textField("IP", this.Ip)
            .textField("Port", this.Port)
            .textField("Login Key", this.LoginKey)
            .divider()
            .label("Behavior")
            .spacer()
            .toggle("Connect On Startup", this.connectOnStartup)
            .toggle("Auto Reconnect", this.autoReconnect)
            .closeButton();
        this.Ip.subscribe(newVal => world.setDynamicProperty("autoConnect:ip", newVal));
        this.Port.subscribe(newVal => {
            let port = Number.parseInt(newVal);
            if (port < 1 || port > 65535 || Number.isNaN(port)) {
                if (newVal !== "")
                    this.Port.setData("1");
                port = 1;
            }
            world.setDynamicProperty("autoConnect:port", port);
        });
        this.LoginKey.subscribe(newVal => world.setDynamicProperty("autoConnect:loginKey", newVal));
        this.connectOnStartup.subscribe(newVal => world.setDynamicProperty("autoConnect:startup", newVal));
        this.autoReconnect.subscribe(newVal => world.setDynamicProperty("autoConnect:reconnect", newVal));
    }
    async ShowAsync() {
        try {
            await this._form.show();
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }
}
