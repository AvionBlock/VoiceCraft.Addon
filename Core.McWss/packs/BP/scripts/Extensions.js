import { Player, World } from "@minecraft/server";
function translateMessagePlayer(message, with_message) {
    this.sendMessage({ translate: message, with: with_message });
}
function translateMessageWorld(message, with_message) {
    this.sendMessage({ translate: message, with: with_message });
}
Player.prototype.translateMessage = translateMessagePlayer;
World.prototype.translateMessage = translateMessageWorld;
