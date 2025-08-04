import { VoiceCraftWorld } from "./VoiceCraftWorld";
import { Event } from "./dependencies/Events";
import {
  McApiPacket,
  LoginPacket,
  LogoutPacket,
  PingPacket,
  AcceptPacket,
  DenyPacket,
  SetEffectPacket,
  AudioPacket,
  SetTitlePacket,
  SetDescriptionPacket,
} from "./dependencies/Packets";

export class VoiceCraft {
  /** @type { Boolean } */
  static #initialized = false;
  static get initialized() {
    return this.#initialized;
  }

  /** @type { VoiceCraftWorld } */
  static #world;
  static get world() {
    if (!this.#initialized)
      throw new Error(
        "Class must be initialized before use! Use the init() function to initialize the class!"
      );
    return this.#world;
  }

  /** @type { PacketEvents } */
  static #packetEvents;
  static get packetEvents() {
    if (!this.#initialized)
      throw new Error(
        "Class must be initialized before use! Use the init() function to initialize the class!"
      );
    return this.#packetEvents;
  }

  constructor() {
    throw new Error("Cannot initialize a static class!");
  }

  static init() {
    this.#world = new VoiceCraftWorld();
    this.#packetEvents = new PacketEvents();
    this.#initialized = true;
  }
}

export class PacketEvents {
  /** @type { Event<McApiPacket> } */
  #unknownPacketEvent = new Event();
  get unknownPacketEvent() {
    return this.#unknownPacketEvent;
  }

  /** @type { Event<LoginPacket> } */
  #loginPacketEvent = new Event();
  get loginPacketEvent() {
    return this.#loginPacketEvent;
  }

  /** @type { Event<LogoutPacket> } */
  #logoutPacketEvent = new Event();
  get logoutPacketEvent() {
    return this.#logoutPacketEvent;
  }

  /** @type { Event<PingPacket> } */
  #pingPacketEvent = new Event();
  get pingPacketEvent() {
    return this.#pingPacketEvent;
  }

  /** @type { Event<AcceptPacket> } */
  #acceptPacketEvent = new Event();
  get acceptPacketEvent() {
    return this.#acceptPacketEvent;
  }

  /** @type { Event<DenyPacket> } */
  #denyPacketEvent = new Event();
  get denyPacketEvent() {
    return this.#denyPacketEvent;
  }

  /** @type { Event<SetEffectPacket> } */
  #setEffectPacketEvent = new Event();
  get setEffectPacketEvent() {
    return this.#setEffectPacketEvent;
  }

  /** @type { Event<AudioPacket> } */
  #audioPacketEvent = new Event();
  get audioPacketEvent() {
    return this.#audioPacketEvent;
  }

  /** @type { Event<SetTitlePacket> } */
  #setTitlePacketEvent = new Event();
  get setTitlePacketEvent() {
    return this.#setTitlePacketEvent;
  }

  /** @type { Event<SetDescriptionPacket> } */
  #setDescriptionPacketEvent = new Event();
  get setDescriptionPacketEvent() {
    return this.#setDescriptionPacketEvent;
  }
}