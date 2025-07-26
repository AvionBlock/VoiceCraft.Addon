import { system, Player } from "@minecraft/server";
import {
  McApiPacket,
  LoginPacket,
  McApiPacketType,
  AcceptPacket,
  PingPacket,
} from "./Packets";
import NetDataWriter from "./NetDataWriter";
import NetDataReader from "./NetDataReader";
import BinaryStringConverter from "../BinaryStringConverter";

export default class VoiceCraft {
  /** @type { Boolean } */
  get isConnected() {
    return this.#_source !== undefined && this.#_sessionToken !== undefined;
  }

  //Connection state objects.
  /** @type { Player | undefined } */
  #_source = undefined;
  /** @type { String | undefined } */
  #_sessionToken = undefined;
  /** @type { NetDataWriter } */
  #_writer = new NetDataWriter();
  /** @type { NetDataReader } */
  #_reader = new NetDataReader();
  /** @type { Number } */
  #_lastPing = 0;

  constructor() {
    system.runInterval(() => this.#handleUpdate(), 20);
    system.afterEvents.scriptEventReceive.subscribe((e) => {
      switch (e.id) {
        case "vc:mcapi":
          this.#handleMcApiEvent(e.sourceEntity, e.message);
          break;
      }
    });
  }

  /**
   * @description Attempts to connect to a VoiceCraft server through MCWSS
   * @param { Player } source
   * @param { String } ip
   * @param { Number } port
   */
  connect(source, loginToken) {
    this.disconnect();
    this.#_source = source;
    const loginPacket = new LoginPacket(loginToken, 1, 1, 0);
    this.#_lastPing = Date.now();
    this.sendPacket(loginPacket);
  }

  /**
   * @description Disconnects from the VoiceCraft server.
   * @returns { Boolean }
   */
  disconnect() {
    if (!this.isConnected) return false;
    this.#_source = undefined;
    this.#_sessionToken = undefined;
    return true;
  }

  /**
   * @param { McApiPacket } packet
   * @returns { Boolean }
   */
  sendPacket(packet) {
    this.#_writer.reset();
    this.#_writer.putByte(packet.PacketId);
    packet.serialize(this.#_writer); //Serialize
    const packetData = BinaryStringConverter.encode(this.#_writer.data, 0, this.#_writer.length);
    if (packetData.length === 0) return;
    this.#_source?.runCommand(
      `tellraw @s {"rawtext":[{"text":"§p§k${packetData}"}]}`
    );
  }

  /**
   * @param { Entity } source
   * @param { String } message
   */
  #handleMcApiEvent(source, message) {
    if (source?.typeId !== "minecraft:player" || message === undefined) return;
    const packetData = BinaryStringConverter.decode(message, 0, message.length);
    this.#_reader.setBufferSource(packetData);
    this.#handlePacket(this.#_reader);
  }

  #handleUpdate() {
    if (!this.isConnected) return;
    if (Date.now() - this.#_lastPing > 5000) {
      this.disconnect();
      return;
    }
    const pingPacket = new PingPacket(this.#_sessionToken);
    this.sendPacket(pingPacket);
  }

  /**
   * @param { NetDataReader } reader
   */
  #handlePacket(reader) {
    const packetId = reader.getByte();
    switch (packetId) {
      case McApiPacketType.Accept:
        const acceptPacket = new AcceptPacket("");
        acceptPacket.deserialize(reader);
        this.#handleAcceptPacket(acceptPacket);
        break;
      case McApiPacketType.Ping:
        const pingPacket = new PingPacket("");
        pingPacket.deserialize(reader);
        this.#handlePingPacket(pingPacket);
        break;
    }
  }

  /**
   * @param { AcceptPacket } packet
   */
  #handleAcceptPacket(packet) {
    this.#_sessionToken = packet.SessionToken;
  }

  /**
   * @param { PingPacket } packet
   */
  #handlePingPacket(packet) {
    if (packet.SessionToken !== this.#_sessionToken) return;
    this.#_lastPing = Date.now();
  }
}
