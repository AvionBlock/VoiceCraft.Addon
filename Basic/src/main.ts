import { McApiOnEntityCreatedPacket } from "./API/Network/McApiPackets/Event/McApiOnEntityCreatedPacket";
import { McApiOnEntityDestroyedPacket } from "./API/Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";
import { McApiOnNetworkEntityCreatedPacket } from "./API/Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import { McApiSetEntityDescriptionRequestPacket } from "./API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { VoiceCraft } from "./API/VoiceCraft";
import { CommandManager } from "./Managers/CommandManager";
const vc = new VoiceCraft();
const cm = new CommandManager(vc);

vc.OnEntityCreatedPacket.Subscribe((ev: McApiOnEntityCreatedPacket) => {
    console.log(`Entity Created: ${ev.Id}`);
});

vc.OnNetworkEntityCreatedPacket.Subscribe((ev: McApiOnNetworkEntityCreatedPacket) => {
    console.log(`Network Entity Joined: ${ev.Id}`);
    if(vc.Token !== undefined)
    {
        vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(vc.Token, ev.Id, "You have connected to the stupid world!"));
    }
});

vc.OnEntityDestroyedPacket.Subscribe((ev: McApiOnEntityDestroyedPacket) => {
    console.log(`Entity Destroyed: ${ev.Id}`);
});