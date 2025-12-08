import { McApiOnEntityAudioReceivedPacket } from "./API/Network/McApiPackets/Event/McApiOnEntityAudioReceivedPacket";
import { VoiceCraft } from "./API/VoiceCraft";
const vc = new VoiceCraft();

vc.OnEntityAudioReceivedPacket.Subscribe((ev: McApiOnEntityAudioReceivedPacket) => {
    console.log(`Audio Packet Received - EntityId: ${ev.Id}, Loudness: ${ev.FrameLoudness}`);
})