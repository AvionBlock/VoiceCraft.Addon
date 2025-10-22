import { system } from "@minecraft/server";
import { McApiMcwss } from "./McApiMcwss";

const vc = new McApiMcwss();

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