import {ModalFormData} from "@minecraft/server-ui";
import {Player, world} from "@minecraft/server";

export class GeneralSettingsForm {
    private _form = (
        broadcastConnected: boolean,
        broadcastDisconnected: boolean,
        broadcastPlayerConnected: boolean,
        broadcastPlayerDisconnected: boolean,
        showVoiceIcons: boolean,
        caveEcho: boolean,
        underwaterMuffle: boolean) => new ModalFormData()
        .title("General Settings")
        .toggle("Broadcast Connected Event", {defaultValue: broadcastConnected})
        .toggle("Broadcast Disconnected Event", {defaultValue: broadcastDisconnected})
        .toggle("Broadcast Player Connected Event", {defaultValue: broadcastPlayerConnected})
        .toggle("Broadcast Player Disconnected Event", {defaultValue: broadcastPlayerDisconnected})
        .toggle("Show Voice Icons", {defaultValue: showVoiceIcons})
        .toggle("Enable Cave Echo", {defaultValue: caveEcho})
        .toggle("Enable Underwater Muffle", {defaultValue: underwaterMuffle});


    public async Show(player: Player) {
        const {cancelationReason, formValues} = await this._form(
            world.getDynamicProperty("general:broadcastConnectedEvent") as boolean ?? false,
            world.getDynamicProperty("general:broadcastDisconnectedEvent") as boolean ?? false,
            world.getDynamicProperty("general:broadcastPlayerConnectedEvent") as boolean ?? false,
            world.getDynamicProperty("general:broadcastPlayerDisconnectedEvent") as boolean ?? false,
            world.getDynamicProperty("general:showVoiceIcons") as boolean ?? false,
            world.getDynamicProperty("general:enableCaveEcho") as boolean ?? false,
            world.getDynamicProperty("general:enableUnderwaterMuffle") as boolean ?? false).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [
            broadcastConnectedEvent,
            broadcastDisconnectedEvent,
            broadcastPlayerConnectedEvent,
            broadcastPlayerDisconnectedEvent,
            showVoiceIcons,
            caveEcho,
            underwaterMuffle] = this.Validate(formValues);

        world.setDynamicProperty("general:broadcastConnectedEvent", broadcastConnectedEvent);
        world.setDynamicProperty("general:broadcastDisconnectedEvent", broadcastDisconnectedEvent);
        world.setDynamicProperty("general:broadcastPlayerConnectedEvent", broadcastPlayerConnectedEvent);
        world.setDynamicProperty("general:broadcastPlayerDisconnectedEvent", broadcastPlayerDisconnectedEvent);
        world.setDynamicProperty("general:showVoiceIcons", showVoiceIcons);
        world.setDynamicProperty("general:enableCaveEcho", caveEcho);
        world.setDynamicProperty("general:enableUnderwaterMuffle", underwaterMuffle);
    }

    private Validate(formValues: (string | number | boolean | undefined)[]): [boolean, boolean, boolean, boolean, boolean, boolean, boolean] {
        //Extract Values
        const [
            broadcastConnectedEventValue,
            broadcastDisconnectedEventValue,
            broadcastPlayerConnectedEventValue,
            broadcastPlayerDisconnectedEventValue,
            showVoiceIconsValue,
            caveEchoValue,
            underwaterMuffleValue] = formValues;

        //Validate Values
        if (typeof broadcastConnectedEventValue !== "boolean" ||
            typeof broadcastDisconnectedEventValue !== "boolean" ||
            typeof broadcastPlayerConnectedEventValue !== "boolean" ||
            typeof broadcastPlayerDisconnectedEventValue !== "boolean" ||
            typeof showVoiceIconsValue !== "boolean" ||
            typeof caveEchoValue !== "boolean" ||
            typeof underwaterMuffleValue !== "boolean")
            throw new Error("Invalid Form Values!");

        //Return Values
        return [broadcastConnectedEventValue,
            broadcastDisconnectedEventValue,
            broadcastPlayerConnectedEventValue,
            broadcastPlayerDisconnectedEventValue,
            showVoiceIconsValue,
            caveEchoValue,
            underwaterMuffleValue];
    }
}