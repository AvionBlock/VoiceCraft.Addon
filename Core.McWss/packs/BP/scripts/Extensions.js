import { Player } from "@minecraft/server";
function translateMessage(message, with_message) {
    this.sendMessage({ translate: message, with: with_message });
}
Player.prototype.translateMessage = translateMessage;
