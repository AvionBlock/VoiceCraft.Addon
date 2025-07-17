import { system, Entity } from "@minecraft/server";
import { VoiceCraft } from "./Network/VoiceCraft";

system.afterEvents.scriptEventReceive.subscribe(e => {
    switch(e.id)
    {
        case "vc:connect":
            HandleConnectEvent(e.sourceEntity, e.message)
            break;
    }
});

/**
 * @param { Entity } source 
 * @param { String } message 
 * @returns { undefined }
 */
function HandleConnectEvent(source, message) {
    if(source?.typeId !== "minecraft:player" || message === undefined) return;
    const [ip, port, loginToken] = message.split(":");
    const portNumber = Number(port);
    if(ip === undefined || portNumber === undefined) return;
    VoiceCraft.ConnectAsync(source, ip, portNumber, loginToken);
}