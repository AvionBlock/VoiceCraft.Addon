import {Player, system, world} from "@minecraft/server";
import {VoiceCraft} from "./API/VoiceCraft";
import {CommandManager} from "./Managers/CommandManager";
import {
    McApiSetEntityPositionRequestPacket
} from "./API/Network/McApiPackets/Request/McApiSetEntityPositionRequestPacket";
import {Vector3} from "./API/Data/Vector3";
import {
    McApiSetEntityRotationRequestPacket
} from "./API/Network/McApiPackets/Request/McApiSetEntityRotationRequestPacket";
import {Vector2} from "./API/Data/Vector2";
import {
    McApiSetEntityWorldIdRequestPacket
} from "./API/Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import {FormManager} from "./Managers/FormManager";
import {BindingSystem} from "./API/Systems/BindingSystem";
import {AudioEffectSystem} from "./API/Systems/AudioEffectSystem";
import {
    McApiSetEntityCaveFactorRequestPacket
} from "./API/Network/McApiPackets/Request/McApiSetEntityCaveFactorRequestPacket";
import {
    McApiSetEntityMuffleFactorRequestPacket
} from "./API/Network/McApiPackets/Request/McApiSetEntityMuffleFactorRequestPacket";
import {Locales} from "./API/Locales";

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
let connectionAttempted = false;
new CommandManager(vc, bs, fm);

world.afterEvents.worldLoad.subscribe(_ => {
    if (!world.getDynamicProperty("autoConnect:startup")) return;
    InitiateConnection();
})

vc.OnEntityCreatedPacket.Subscribe(ev => {
    console.log(`Received Entity Created: ${ev.Id}`);
})

vc.OnNetworkEntityCreatedPacket.Subscribe(ev => {
    console.log(`Received Network Entity Created: ${ev.Id}`);
})

vc.OnConnected.Subscribe(_ => {
    console.log("Connected Event");
    connectionAttempted = false;

    if (world.getDynamicProperty("general:broadcastConnectedEvent")) {
        world.sendMessage({translate: Locales.VcMcApi.Status.Broadcast.Connected});
    }
})

vc.OnDisconnected.Subscribe(_ => {
    if (world.getDynamicProperty("general:broadcastDisconnectedEvent")) {
        world.sendMessage({translate: Locales.VcMcApi.Status.Broadcast.Disconnected});
    }

    if (!world.getDynamicProperty("autoConnect:reconnect") || connectionAttempted) return;
    connectionAttempted = true;
    InitiateConnection();
})

vc.OnPlayerBind.Subscribe(player => {
    if (world.getDynamicProperty("general:broadcastPlayerConnectedEvent")) {
        const playerObj = world.getAllPlayers().find(x => x.id === player.playerId);
        if (playerObj === undefined) return;
        world.sendMessage({translate: Locales.VcMcApi.Status.Broadcast.PlayerConnected, with: [playerObj.name]});
    }
})

vc.OnPlayerUnbind.Subscribe(player => {
    if (world.getDynamicProperty("general:broadcastPlayerDisconnectedEvent")) {
        const playerObj = world.getAllPlayers().find(x => x.id === player.playerId);
        if (playerObj === undefined) return;
        world.sendMessage({translate: Locales.VcMcApi.Status.Broadcast.PlayerDisconnected, with: [playerObj.name]});
    }
})

vc.OnEntityAudioReceivedPacket.Subscribe(ev => {
    const playerId = bs.GetBoundPlayer(ev.Id);
    if (playerId === undefined) return;
    const playerObj = world.getAllPlayers().find(x => x.id === playerId);
    if (playerObj === undefined) return;
    playerObj.setDynamicProperty("data:lastSpoke", Date.now());
})

system.runInterval(() => IntervalLogic(), 0);

function IntervalLogic() {
    const players = world.getAllPlayers();
    if (world.getDynamicProperty("general:showVoiceIcons")) {
        for (const player of players) {
            const lastSpoke = player.getDynamicProperty("data:lastSpoke") as number ?? 0;
            if (!bs.BoundPlayers.includes(player)) {
                if(!player.nameTag.includes(String.fromCodePoint(61442)))
                    player.nameTag = `${player.name} ${String.fromCodePoint(61442)}`
            } else if (Date.now() - lastSpoke > 200) {
                if(!player.nameTag.includes(String.fromCodePoint(61440)))
                    player.nameTag = `${player.name} ${String.fromCodePoint(61440)}`
            } else if (Date.now() - lastSpoke < 200) {
                if(!player.nameTag.includes(String.fromCodePoint(61441)))
                    player.nameTag = `${player.name} ${String.fromCodePoint(61441)}`
            }
        }
    } else {
        for (const player of players) {
            if (player.nameTag.includes(String.fromCodePoint(61440)) || player.nameTag.includes(String.fromCodePoint(61441)) || player.nameTag.includes(String.fromCodePoint(61442)))
                player.nameTag = player.name;
        }
    }

    if (vc.Token === undefined) return;

    for (const player of players) {
        const entityId = bs.GetBoundEntity(player.id);
        if (entityId === undefined) continue;
        const worldId = player.dimension.id;
        const location = player.location;
        const rotation = player.getRotation();
        vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, worldId));
        vc.SendPacket(new McApiSetEntityPositionRequestPacket(entityId, new Vector3(location.x, location.y, location.z)));
        vc.SendPacket(new McApiSetEntityRotationRequestPacket(entityId, new Vector2(rotation.x, rotation.y)));

        const caveEchoEnabled = world.getDynamicProperty("general:enableCaveEcho") as boolean;
        const underwaterMuffleEnabled = world.getDynamicProperty("general:enableUnderwaterMuffle") as boolean;

        if (caveEchoEnabled) {
            vc.SendPacket(new McApiSetEntityCaveFactorRequestPacket(entityId, GetCaveDensity(player)));
        } else {
            vc.SendPacket(new McApiSetEntityCaveFactorRequestPacket(entityId, 0.0));
        }

        if (underwaterMuffleEnabled) {
            vc.SendPacket(new McApiSetEntityMuffleFactorRequestPacket(entityId, IsUnderwater(player) ? 1.0 : 0));
        } else {
            vc.SendPacket(new McApiSetEntityMuffleFactorRequestPacket(entityId, 0));
        }
    }
}

function GetCaveDensity(player: Player) {
    try {
        const dimension = player.dimension;
        const headLocation = player.getHeadLocation();
        let total = cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: 1,
            z: 0
        }, {maxDistance: 20})?.block.type.id ?? "") ? 1 : 0; //Up
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: -1,
            z: 0
        }, {maxDistance: 20})?.block.type.id ?? "") ? 1 : 0; //Down
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: -1,
            y: 0,
            z: 0
        }, {maxDistance: 20})?.block.type.id ?? "") ? 1 : 0; //Left
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 1,
            y: 0,
            z: 0
        }, {maxDistance: 20})?.block.type.id ?? "") ? 1 : 0; //Right
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: 0,
            z: 1
        }, {maxDistance: 20})?.block.type.id ?? "") ? 1 : 0; //Forward
        total += cv.includes(dimension.getBlockFromRay(headLocation, {
            x: 0,
            y: 0,
            z: -1
        }, {maxDistance: 20})?.block.type.id ?? "") ? 1 : 0; //Backwards
        return total / 6;
    } catch (ex) {
        return 0.0;
    }
}

function IsUnderwater(player: Player): boolean {
    try {
        return player.dimension.getBlock(
            player.getHeadLocation()
        )?.isLiquid ?? false;
    } catch (ex) {
        return false;
    }
}

function InitiateConnection() {
    const ip = world.getDynamicProperty("autoConnect:ip");
    const port = world.getDynamicProperty("autoConnect:port");
    const loginKey = world.getDynamicProperty("autoConnect:loginKey");

    if (typeof ip != "string" || typeof port != "number" || typeof loginKey != "string") return;
    world.getDimension("minecraft:overworld").runCommand(`vcconnect_raw \"${ip}\" ${port} \"${loginKey}\"`);
}