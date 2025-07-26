import { system } from "@minecraft/server";
import VoiceCraft from "./network/VoiceCraftBinary";
import BinaryStringConverter from "./BinaryStringConverter";
import NetDataWriter from "./network/NetDataWriter";

const writer = new NetDataWriter();
writer.putFloat(0.0261);
const str = Base256.encode(writer.data, 0, writer.length);
const bytes = Base256.decode(str, 0, str.length);
console.warn(writer.data);
console.warn(str);
console.warn(str.length);
console.warn(bytes);

/*
const vc = new VoiceCraft();

system.afterEvents.scriptEventReceive.subscribe((e) => {
  switch (e.id) {
    case "vc:connect":
        vc.connect(e.sourceEntity, "test");
      break;
  }
});
*/