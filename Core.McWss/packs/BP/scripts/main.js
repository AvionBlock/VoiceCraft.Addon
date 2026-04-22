import { McApiMcWss } from "./McApiMcWss";
import { system } from "@minecraft/server";
import { VoiceCraft } from "./API/VoiceCraft";
import { NetDataWriter } from "./API/Data/NetDataWriter";
import { Z85 } from "./API/Encoders/Z85";
const vc = new McApiMcWss();
const writer = new NetDataWriter();
system.runInterval(() => {
    vc.Update();
});
vc.OnConnected.Subscribe((ev) => {
    system.sendScriptEvent(`${VoiceCraft.Namespace}:onConnected`, ev);
});
vc.OnDisconnected.Subscribe((ev) => {
    system.sendScriptEvent(`${VoiceCraft.Namespace}:onDisconnected`, ev);
});
vc.OnPacketReceived.Subscribe((ev) => {
    writer.Reset();
    writer.PutPacket(ev);
    system.sendScriptEvent(`${VoiceCraft.Namespace}:onPacket`, Z85.GetStringWithPadding(writer.CopyData()));
});
