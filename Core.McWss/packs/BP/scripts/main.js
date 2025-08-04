import { system } from "@minecraft/server";
import { VoiceCraftMcWss } from "./network/VoiceCraftMcWss";
const vc = new VoiceCraftMcWss();

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