import { CustomForm, ObservableBoolean } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
export class GeneralSettingsForm {
    _player;
    _form;
    //Broadcasts
    broadcastConnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastConnectedEvent") ?? false, { clientWritable: true });
    broadcastDisconnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastDisconnectedEvent") ?? false, { clientWritable: true });
    broadcastPlayerConnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastPlayerConnectedEvent") ?? false, { clientWritable: true });
    broadcastPlayerDisconnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastPlayerDisconnectedEvent") ?? false, { clientWritable: true });
    //Effects
    enableCaveEcho = new ObservableBoolean(world.getDynamicProperty("general:enableCaveEcho") ?? false, { clientWritable: true });
    enableUnderwaterMuffle = new ObservableBoolean(world.getDynamicProperty("general:enableUnderwaterMuffle") ?? false, { clientWritable: true });
    //Visual
    showVoiceIcons = new ObservableBoolean(world.getDynamicProperty("general:showVoiceIcons") ?? false, { clientWritable: true });
    constructor(_player) {
        this._player = _player;
        this._form = new CustomForm(this._player, "General Settings")
            .spacer()
            .label("Broadcast Events")
            .spacer()
            .toggle("Server Connected", this.broadcastConnectedEvent)
            .toggle("Server Disconnected", this.broadcastDisconnectedEvent)
            .toggle("Player Connected", this.broadcastPlayerConnectedEvent)
            .toggle("Player Disconnected", this.broadcastPlayerDisconnectedEvent)
            .divider()
            .label("Voice Effects")
            .spacer()
            .toggle("Enable Cave Echo", this.enableCaveEcho)
            .toggle("Enable Underwater Muffle", this.enableUnderwaterMuffle)
            .divider()
            .label("Visual")
            .spacer()
            .toggle("Show Voice Icons", this.showVoiceIcons)
            .closeButton();
        this.broadcastConnectedEvent.subscribe(newVal => world.setDynamicProperty("general:broadcastConnectedEvent", newVal));
        this.broadcastDisconnectedEvent.subscribe(newVal => world.setDynamicProperty("general:broadcastDisconnectedEvent", newVal));
        this.broadcastPlayerConnectedEvent.subscribe(newVal => world.setDynamicProperty("general:broadcastPlayerConnectedEvent", newVal));
        this.broadcastPlayerDisconnectedEvent.subscribe(newVal => world.setDynamicProperty("general:broadcastPlayerDisconnectedEvent", newVal));
        this.enableCaveEcho.subscribe(newVal => world.setDynamicProperty("general:enableCaveEcho", newVal));
        this.enableUnderwaterMuffle.subscribe(newVal => world.setDynamicProperty("general:enableUnderwaterMuffle", newVal));
        this.showVoiceIcons.subscribe(newVal => world.setDynamicProperty("general:showVoiceIcons", newVal));
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
