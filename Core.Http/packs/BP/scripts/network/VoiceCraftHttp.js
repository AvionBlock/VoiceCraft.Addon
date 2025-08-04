import { system, Player } from "@minecraft/server";
import {
  VoiceCraft,
  NetDataWriter,
  NetDataReader,
  Z85,
  Locales,
  McApiPacketType,
  McApiPacket,
  LoginPacket,
  LogoutPacket,
  AcceptPacket,
  PingPacket,
  DenyPacket } from "../dependencies/VoiceCraftAPI";

export class VoiceCraftHttp {
  /** @type { Boolean } */
  get isConnected() {
    return (
      this.#_connecting ||
      (this.#_source !== undefined && this.#_sessionToken !== undefined)
    );
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
  /** @type { Boolean } */
  #_connecting = false;

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
   * @description Attempts to connect to a VoiceCraft server through HTTP
   * @param { Player } source
   * @param { String } ip
   * @param { Number } port
   */
  connect(source, loginToken) {
    this.disconnect();
    this.#_source = source;
    const loginPacket = new LoginPacket(
      loginToken,
      VoiceCraft.version.major,
      VoiceCraft.version.minor,
      VoiceCraft.version.build
    );
    this.#_lastPing = Date.now();
    this.#_connecting = true;
    this.sendPacket(loginPacket);
  }

  /**
   * @description Disconnects from the VoiceCraft server.
   * @param { String } reasonKey
   * @returns { Boolean }
   */
  disconnect(reasonKey = Locales.LocaleKeys.McApi.DisconnectReason.None) {
    if (!this.isConnected) return false;
    if (!this.#_connecting)
      this.sendPacket(new LogoutPacket(this.#_sessionToken));
    if (reasonKey !== undefined)
      this.#_source.sendMessage({ translate: reasonKey });
    this.#_connecting = false;
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
    this.#_writer.putByte(packet.packetId);
    packet.serialize(this.#_writer); //Serialize
    //Set packet bytes here.
    if (packetData.length === 0) return;
    //Send as HTTP packet
  }

  /**
   * @param { Entity } source
   * @param { String } message
   */
  #handleMcApiEvent(source, message) {
    if (source?.typeId !== "minecraft:player" || message === undefined) return;
    /** @type { Uint8Array } */
    const packetData = Z85.getBytesWithPadding(message);
    this.#_reader.setBufferSource(packetData);
    this.#handlePacket(this.#_reader);
    system.sendScriptEvent("vcapi:core", message);
  }

  #handleUpdate() {
    if (!this.isConnected) return;
    if (Date.now() - this.#_lastPing > 5000) {
      this.disconnect(Locales.LocaleKeys.McApi.DisconnectReason.Timeout);
      return;
    }
    //Send any buffered packets here.
    if (this.#_connecting) return; //If in connecting state. do not ping.
    const pingPacket = new PingPacket(this.#_sessionToken);
    this.sendPacket(pingPacket);
  }

  /**
   * @param { NetDataReader } reader
   */
  #handlePacket(reader) {
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
  #handleAcceptPacket(packet) {
    this.#_sessionToken = packet.sessionToken;
    this.#_connecting = false;
  }

  /**
   * @param { DenyPacket } packet
   */
  #handleDenyPacket(packet) {
    this.disconnect(packet.reasonKey);
  }

  /**
   * @param { PingPacket } packet
   */
  #handlePingPacket(packet) {
    if (packet.sessionToken !== this.#_sessionToken) return;
    this.#_lastPing = Date.now();
  }
}
