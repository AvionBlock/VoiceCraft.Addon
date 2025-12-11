import { PlayerLeaveAfterEvent, system, world } from "@minecraft/server";
import { VoiceCraft } from "./API/VoiceCraft";
import { BindingManager } from "./Managers/BindingManager";
import { CommandManager } from "./Managers/CommandManager";
import { McApiSetEntityPositionRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityPositionRequestPacket";
import { Vector3 } from "./API/Data/Vector3";
import { McApiSetEntityRotationRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityRotationRequestPacket";
import { Vector2 } from "./API/Data/Vector2";
import { McApiSetEntityWorldIdRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
const vc = new VoiceCraft();
const bm = new BindingManager(vc);
new CommandManager(vc, bm);

system.runInterval(() => IntervalLogic(), 0)
world.afterEvents.playerLeave.subscribe((ev) => HandlePlayerLeaveEvent(ev))

function HandlePlayerLeaveEvent(ev: PlayerLeaveAfterEvent) {
    bm.UnbindPlayer(ev.playerId);
}

function IntervalLogic() {
    if(vc.Token === undefined) return;

    const players = world.getAllPlayers();
    for(const player of players)
    {
        const entityId = bm.GetEntityFromPlayerId(player.id);
        if(entityId === undefined) continue;
        const worldId = player.dimension.id;
        const location = player.location;
        const rotation = player.getRotation();
        vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(vc.Token, entityId, worldId));
        vc.SendPacket(new McApiSetEntityPositionRequestPacket(vc.Token, entityId, new Vector3(location.x, location.y, location.z)));
        vc.SendPacket(new McApiSetEntityRotationRequestPacket(vc.Token, entityId, new Vector2(rotation.x, rotation.y)));
    }
}