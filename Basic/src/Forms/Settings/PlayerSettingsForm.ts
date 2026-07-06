import {Player} from "@minecraft/server";
import {ActionFormData} from "@minecraft/server-ui";
import {VoiceCraft} from "../../API/VoiceCraft";
import {BindingSystem} from "../../API/Systems/BindingSystem";
import {Guid} from "../../API/Data/Guid";
import {McApiDestroyEntityRequestPacket} from "../../API/Network/McApiPackets/Request/McApiDestroyEntityRequestPacket";
import {McApiSetEntityMuteRequestPacket} from "../../API/Network/McApiPackets/Request/McApiSetEntityMuteRequestPacket";
import {McApiSetEntityDeafenRequestPacket} from "../../API/Network/McApiPackets/Request/McApiSetEntityDeafenRequestPacket";

export class PlayerSettingsForm {
    constructor(private _vc: VoiceCraft, private _bs: BindingSystem) {
    }

    private _form = (player: Player) => {
        return new ActionFormData()
            .title(`${player.name}`)
            .button("Kick")
            .button("Mute")
            .button("Unmute")
            .button("Deafen")
            .button("Undeafen");
    }

    public async Show(player: Player) {
        const selectedPlayer = await new SelectPlayerSettingsForm(this._bs).Show(player);
        if(selectedPlayer === undefined)
            throw new Error("No Player Selected!");

        const form = this._form(selectedPlayer);
        const {canceled, selection} = await form.show(player);
        if (canceled || selection === undefined) return;
        let entityId = undefined;

        switch (selection) {
            case 0:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiDestroyEntityRequestPacket(Guid.Create().toString(), entityId));
                break;
            case 1:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityMuteRequestPacket(entityId, true));
                break;
            case 2:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityMuteRequestPacket(entityId, false));
                break;
            case 3:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityDeafenRequestPacket(entityId, true));
                break;
            case 4:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityDeafenRequestPacket(entityId, false));
                break;
        }
    }
}

class SelectPlayerSettingsForm {
    constructor(private _bs: BindingSystem) {
    }

    private _form = () => {
        const form = new ActionFormData()
            .title("Select Player")
        const players = this._bs.BoundPlayers;
        for (const player of players) {
            form.button(`${player.name}`);
        }
        return {players: players, form: form};
    }

    public async Show(player: Player): Promise<Player | undefined> {
        const form = this._form();
        const {canceled, selection} = await form.form.show(player);
        if (canceled || selection === undefined) return undefined;
        return form.players[selection];
    }
}