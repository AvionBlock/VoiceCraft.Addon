import { Player, RawMessage } from "@minecraft/server";

function translateMessage(
  this: Player,
  message: string,
  with_message?: RawMessage | string[]
) {
  this.sendMessage({ translate: message, with: with_message });
}

// Declare the Extension
declare module "@minecraft/server" {
  interface Player {
    translateMessage(message: string, with_message?: RawMessage | string[]): void;
  }
}

Player.prototype.translateMessage = translateMessage;