import { system, Player } from "@minecraft/server";
import { McApiPacket, LoginPacket } from "./Packets";

class VoiceCraft {
    //Connection state objects.
    /** @type { Player | undefined } */
    _source = undefined;
    /** @type { String | undefined } */
    _sessionToken = undefined;
    /** @type { Boolean } */
    isConnected = () => this._source !== undefined && this._sessionToken !== undefined;

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
    this._source = source;
    const loginPacket = new LoginPacket(loginToken, 1, 1, 0);
    this.sendPacket(loginPacket);
  }

  /**
   * @description Disconnects from the VoiceCraft server.
   * @returns { Boolean }
   */
  disconnect() {
    if(!this.isConnected) return false;

    this._source = undefined;
    this._sessionToken = undefined;
    this._incomingPackets = new Array<Uint8Array>(0);
    this._outgoingPackets = new Array<Uint8Array>(0);
    return true;
  }

  /**
   * @param { McApiPacket } packet
   * @returns { Boolean }
   */
  sendPacket(packet)
  {
    const serializeBuffer = new Uint8Array();
    packet.serialize(serializeBuffer); //Serialize
    const packetData = #.decode(serializeBuffer); //Convert to string.
    this._source.runCommand(`tellraw @s {"rawtext":[{"text":"${packetData}"}]}`);
  }

  /**
   * @param { Entity } source
   * @param { String } message
   */
  handleMcApiEvent(source, message) {
    if (source?.typeId !== "minecraft:player" || message === undefined) return;
    let packetIndex = 0;
    const packetData = #.encode(message);
    const packetId = packetData[packetIndex++]; //Read first byte which is the packet id.
    this.handlePacket(packetId, packetData, packetIndex);
  }

  /**
   * @param { Number } packetId
   * @param { Uint8Array } packetData
   * @param { Number } packetIndex
   */
  handlePacket(packetId, packetData, packetIndex)
  {
    switch(packetId)
    {
        
    }
  }
}

export { VoiceCraft }