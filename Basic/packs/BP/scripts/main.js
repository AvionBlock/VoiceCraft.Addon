import { VoiceCraft } from "./API/VoiceCraft";
const vc = new VoiceCraft();
vc.OnEntityAudioReceivedPacket.Subscribe((ev) => {
    console.log(`Audio Packet Received - EntityId: ${ev.Id}, Loudness: ${ev.FrameLoudness}`);
});
