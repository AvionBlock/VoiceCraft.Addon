import { VoiceCraftWorld } from "./VoiceCraftWorld";
import { Event } from "./Event";
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
  McApiPacketType,
} from "./network/Packets";
import { NetDataReader } from "./network/NetDataReader";
import { NetDataWriter } from "./network/NetDataWriter";

export class VoiceCraft {
  static #version = Object.freeze({ major: 1, minor: 1, build: 0 });
  static get version() {
    return this.#version;
  }

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

  /** @type { NetDataWriter } */
  static #_writer = new NetDataWriter();
  /** @type { NetDataReader } */
  static #_reader = new NetDataReader();

  constructor() {
    throw new Error("Cannot initialize a static class!");
  }

  static init() {
    system.afterEvents.scriptEventReceive.subscribe((e) => {
      switch (e.id) {
        case "vc:core_api_receive":
          this.#handleReceiveMcApiEvent(e.message);
          break;
      }
    });

    this.#world = new VoiceCraftWorld();
    this.#packetEvents = new PacketEvents();
    this.#initialized = true;
  }

  /**
   * @param { Entity } source
   * @param { String } message
   */
  static #handleReceiveMcApiEvent(message) {
    if (message === undefined) return;
    /** @type { Uint8Array } */
    const packetData = Z85.getBytesWithPadding(message);
    this.#_reader.setBufferSource(packetData);
    this.#handlePacket(this.#_reader);
  }

  /**
   * @param { NetDataReader } reader
   */
  static #handlePacket(reader) {
    const packetId = reader.getByte();
    switch (packetId) {
      case McApiPacketType.accept:
        const acceptPacket = new AcceptPacket();
        acceptPacket.deserialize(reader);
        this.#handleAcceptPacket(acceptPacket);
        break;
      case McApiPacketType.deny:
        const denyPacket = new DenyPacket();
        denyPacket.deserialize(reader);
        this.#handleDenyPacket(denyPacket);
        break;
      case McApiPacketType.ping:
        const pingPacket = new PingPacket();
        pingPacket.deserialize(reader);
        this.#handlePingPacket(pingPacket);
        break;
    }
  }

  /**
   * @param { AcceptPacket } packet
   */
  static #handleAcceptPacket(packet) {
    this.#packetEvents.acceptPacketEvent.emit(packet);
  }

  /**
   * @param { DenyPacket } packet
   */
  static #handleDenyPacket(packet) {
    this.#packetEvents.denyPacketEvent.emit(packet);
  }

  /**
   * @param { PingPacket } packet
   */
  static #handlePingPacket(packet) {
    this.#packetEvents.pingPacketEvent.emit(packet);
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
