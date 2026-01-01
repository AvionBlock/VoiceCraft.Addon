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
import { McApiSetEntityCaveFactorRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityCaveFactorRequestPacket";
import { McApiSetEntityMuffleFactorRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityMuffleFactorRequestPacket";
const cv = [
    "minecraft:stone",
    "minecraft:diorite",
    "minecraft:granite",
    "minecraft:deepslate",
    "minecraft:tuff",
];
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
        const caveEchoEnabled = world.getDynamicProperty(`${VoiceCraft.Namespace}:enableCaveEcho`);
        const underwaterMuffleEnabled = world.getDynamicProperty(`${VoiceCraft.Namespace}:enableUnderwaterMuffle`);
        if (caveEchoEnabled) {
            vc.SendPacket(new McApiSetEntityCaveFactorRequestPacket(entityId, GetCaveDensity(player)));
        }
        else {
            vc.SendPacket(new McApiSetEntityCaveFactorRequestPacket(entityId, 0.0));
        }
        if (underwaterMuffleEnabled) {
            vc.SendPacket(new McApiSetEntityMuffleFactorRequestPacket(entityId, IsUnderwater(player) ? 1.0 : 0));
        }
        else {
            vc.SendPacket(new McApiSetEntityMuffleFactorRequestPacket(entityId, 0));
        }
    }
}
function GetCaveDensity(player) {
    try {
        const dimension = player.dimension;
        const headLocation = player.getHeadLocation();
        let total = cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: 1,
            z: 0
        }, { maxDistance: 20 })?.block.type.id ?? "") ? 1 : 0; //Up
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: -1,
            z: 0
        }, { maxDistance: 20 })?.block.type.id ?? "") ? 1 : 0; //Down
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: -1,
            y: 0,
            z: 0
        }, { maxDistance: 20 })?.block.type.id ?? "") ? 1 : 0; //Left
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 1,
            y: 0,
            z: 0
        }, { maxDistance: 20 })?.block.type.id ?? "") ? 1 : 0; //Right
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: 0,
            z: 1
        }, { maxDistance: 20 })?.block.type.id ?? "") ? 1 : 0; //Forward
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: 0,
            z: -1
        }, { maxDistance: 20 })?.block.type.id ?? "") ? 1 : 0; //Backwards
        return total / 6;
    }
    catch (ex) {
        return 0.0;
    }
}
function IsUnderwater(player) {
    try {
        return player.dimension.getBlock(player.getHeadLocation())?.isLiquid ?? false;
    }
    catch (ex) {
        return false;
    }
}
