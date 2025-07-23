import { system, Player } from "@minecraft/server";
import { McApiPacket, LoginPacket, McApiPacketType, AcceptPacket } from "./Packets";
import NetDataWriter from "./NetDataWriter";
import NetDataReader from "./NetDataReader";
import { Base64 } from '../base64';

export default class VoiceCraft {
  /** @type { Boolean } */
  isConnected = () =>
    this.#_source !== undefined && this.#_sessionToken !== undefined;

  //Connection state objects.
  /** @type { Player | undefined } */
  #_source = undefined;
  /** @type { String | undefined } */
  #_sessionToken = undefined;
  /** @type { NetDataWriter } */
  #_writer = new NetDataWriter();
  /** @type { NetDataReader } */
  #_reader = new NetDataReader();

  constructor() {
    system.afterEvents.scriptEventReceive.subscribe((e) => {
      switch (e.id) {
        case "vc:mcapi":
          this.handleMcApiEvent(e.sourceEntity, e.message);
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
    const packetData = Base64.fromUint8Array(this.#_writer.uint8Data.slice(0, this.#_writer.length));
    if (packetData.length === 0) return;
    this.#_source?.runCommand(
      `tellraw @s {"rawtext":[{"text":"§p§k${packetData}"}]}`
    );
  }

  /**
   * @param { Entity } source
   * @param { String } message
   */
  handleMcApiEvent(source, message) {
    if (source?.typeId !== "minecraft:player" || message === undefined) return;
    const packetData = Base64.toUint8Array(message);
    this.#_reader.setUint8BufferSource(packetData);
    this.handlePacket(this.#_reader);
  }

  /**
   * @param { NetDataReader } reader
   */
  handlePacket(reader) {
    const packetId = reader.getByte();
    switch (packetId) {
      case McApiPacketType.Accept:
        const acceptPacket = new AcceptPacket("");
        acceptPacket.deserialize(reader);
        console.warn(`Login Accepted: Session Token - ${acceptPacket.SessionToken}`);
        break;
    }
  }
}