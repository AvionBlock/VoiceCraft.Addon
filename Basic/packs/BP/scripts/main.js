import { system, world } from "@minecraft/server";
import { VoiceCraft } from "./API/VoiceCraft";
import { CommandManager } from "./Managers/CommandManager";
import { McApiSetEntityPositionRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityPositionRequestPacket";
import { Vector3 } from "./API/Data/Vector3";
import { McApiSetEntityRotationRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityRotationRequestPacket";
import { Vector2 } from "./API/Data/Vector2";
import { McApiSetEntityWorldIdRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import { FormManager } from "./Managers/FormManager";
import { BindingSystem } from "./API/Systems/BindingSystem";
import { AudioEffectSystem } from "./API/Systems/AudioEffectSystem";
const vc = new VoiceCraft();
const bs = new BindingSystem(vc);
const aes = new AudioEffectSystem(vc);
const fm = new FormManager(vc, bs, aes);
new CommandManager(vc, bs, fm);
system.runInterval(() => IntervalLogic(), 0);
function IntervalLogic() {
    if (vc.Token === undefined)
        return;
    const players = world.getAllPlayers();
    for (const player of players) {
        const entityId = bs.GetBoundEntity(player.id);
        if (entityId === undefined)
            continue;
        const worldId = player.dimension.id;
        const location = player.location;
        const rotation = player.getRotation();
        vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, worldId));
        vc.SendPacket(new McApiSetEntityPositionRequestPacket(entityId, new Vector3(location.x, location.y, location.z)));
        vc.SendPacket(new McApiSetEntityRotationRequestPacket(entityId, new Vector2(rotation.x, rotation.y)));
    }
}
