import { CustomForm, ObservableBoolean, ObservableNumber } from "@minecraft/server-ui";
import { system } from "@minecraft/server";
import { McApiDestroyEntityRequestPacket } from "../../API/Network/McApiPackets/Request/McApiDestroyEntityRequestPacket";
import { Guid } from "../../API/Data/Guid";
import { McApiSetEntityMuteRequestPacket } from "../../API/Network/McApiPackets/Request/McApiSetEntityMuteRequestPacket";
import { McApiSetEntityDeafenRequestPacket } from "../../API/Network/McApiPackets/Request/McApiSetEntityDeafenRequestPacket";
import { PlayerSetPropertySettingsForm } from "./Player/PlayerSetPropertySettingsForm";
export class PlayerSettingsForm {
    _player;
    _vc;
    _bs;
    _form;
    _selectedPlayer = new ObservableNumber(0, { clientWritable: true });
    _controlsDisabled = new ObservableBoolean(true);
    constructor(_player, _vc, _bs) {
        this._player = _player;
        this._vc = _vc;
        this._bs = _bs;
        const playersDropdownList = [{ label: "None", value: 0 }];
        const playersList = [];
        for (const player of this._bs.BoundPlayers.entries()) {
            playersDropdownList.push({ label: player[1].name, value: player[0] + 1 });
            playersList.push(player[1]);
        }
        this._form = new CustomForm(this._player, "Player Settings")
            .spacer()
            .dropdown("Player", this._selectedPlayer, playersDropdownList)
            .spacer()
            .button("Kick", () => this.Kick(playersList), { disabled: this._controlsDisabled })
            .button("Mute", () => this.SetMute(playersList, true), { disabled: this._controlsDisabled })
            .button("Unmute", () => this.SetMute(playersList, false), { disabled: this._controlsDisabled })
            .button("Deafen", () => this.SetDeafen(playersList, true), { disabled: this._controlsDisabled })
            .button("Undeafen", () => this.SetDeafen(playersList, false), { disabled: this._controlsDisabled })
            .button("Set Property", () => this.ShowSetPropertiesSettings(playersList), { disabled: this._controlsDisabled })
            .closeButton();
        this._selectedPlayer.subscribe(newVal => {
            if (newVal === 0) {
                this._controlsDisabled.setData(true);
                return;
            }
            this._controlsDisabled.setData(false);
        });
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
    Kick(playerList) {
        try {
            const player = playerList[this._selectedPlayer.getData() - 1];
            const entityId = this._bs.GetBoundEntity(player.id);
            if (entityId === undefined)
                return;
            this._vc.SendPacket(new McApiDestroyEntityRequestPacket(Guid.Create().toString(), entityId));
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }
    SetMute(playerList, value) {
        try {
            const player = playerList[this._selectedPlayer.getData() - 1];
            const entityId = this._bs.GetBoundEntity(player.id);
            if (entityId === undefined)
                return;
            this._vc.SendPacket(new McApiSetEntityMuteRequestPacket(entityId, value));
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }
    SetDeafen(playerList, value) {
        try {
            const player = playerList[this._selectedPlayer.getData() - 1];
            const entityId = this._bs.GetBoundEntity(player.id);
            if (entityId === undefined)
                return;
            this._vc.SendPacket(new McApiSetEntityDeafenRequestPacket(entityId, value));
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }
    ShowSetPropertiesSettings(playerList) {
        try {
            const player = playerList[this._selectedPlayer.getData() - 1];
            const entityId = this._bs.GetBoundEntity(player.id);
            if (entityId === undefined)
                return;
            system.run(async () => await new PlayerSetPropertySettingsForm(this._player, this._vc, entityId).ShowAsync());
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }
}
