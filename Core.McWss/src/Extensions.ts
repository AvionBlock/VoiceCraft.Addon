import { Player, RawMessage, World } from "@minecraft/server";

function translateMessagePlayer(
  this: Player,
  message: string,
  with_message?: RawMessage | string[]
) {
  this.sendMessage({ translate: message, with: with_message });
}

function translateMessageWorld(
  this: World,
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
  interface World {
    translateMessage(message: string, with_message?: RawMessage | string[]): void;
  }
}

Player.prototype.translateMessage = translateMessagePlayer;
World.prototype.translateMessage = translateMessageWorld;