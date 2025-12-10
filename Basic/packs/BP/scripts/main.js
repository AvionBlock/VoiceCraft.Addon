import { VoiceCraft } from "./API/VoiceCraft";
import { BindingManager } from "./Managers/BindingManager";
import { CommandManager } from "./Managers/CommandManager";
const vc = new VoiceCraft();
const bm = new BindingManager(vc);
const cm = new CommandManager(vc, bm);
