import {CustomForm, ObservableBoolean} from "@minecraft/server-ui";
import {Player, world} from "@minecraft/server";

export class GeneralSettingsForm {
    private readonly _form;

    //Broadcasts
    private broadcastConnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastConnectedEvent") as boolean ?? false, {clientWritable: true});
    private broadcastDisconnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastDisconnectedEvent") as boolean ?? false, {clientWritable: true});
    private broadcastPlayerConnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastPlayerConnectedEvent") as boolean ?? false, {clientWritable: true});
    private broadcastPlayerDisconnectedEvent = new ObservableBoolean(world.getDynamicProperty("general:broadcastPlayerDisconnectedEvent") as boolean ?? false, {clientWritable: true});

    //Effects
    private enableCaveEcho = new ObservableBoolean(world.getDynamicProperty("general:enableCaveEcho") as boolean ?? false, {clientWritable: true});
    private enableUnderwaterMuffle = new ObservableBoolean(world.getDynamicProperty("general:enableUnderwaterMuffle") as boolean ?? false, {clientWritable: true});

    //Visual
    private showVoiceIcons = new ObservableBoolean(world.getDynamicProperty("general:showVoiceIcons") as boolean ?? false, {clientWritable: true});

    constructor(private _player: Player) {
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

    public async ShowAsync() {
        try {
            await this._form.show();
        }
        catch (error) {
            if(this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }
}