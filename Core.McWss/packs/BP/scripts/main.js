import { system } from "@minecraft/server";
import VoiceCraft from "./network/VoiceCraft";

const vc = new VoiceCraft();

system.afterEvents.scriptEventReceive.subscribe((e) => {
  switch (e.id) {
    case "vc:connect":
        vc.connect(e.sourceEntity, "test");
      break;
  }
});