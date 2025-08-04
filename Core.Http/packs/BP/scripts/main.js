import { system } from "@minecraft/server";
import { VoiceCraftHttp } from "./network/VoiceCraftHttp";
const vc = new VoiceCraftHttp();

system.afterEvents.scriptEventReceive.subscribe((e) => {
  switch (e.id) {
    case "vc:connect":
      vc.connect(e.sourceEntity, "tea");
      break;
    case "vc:disconnect":
      vc.disconnect();
      break;
  }
});