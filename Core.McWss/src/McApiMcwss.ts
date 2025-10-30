import { VoiceCraft } from "./API/VoiceCraft";
import { InternalConnectPacket } from "./API/Network/InternalPackets/InternalConnectPacket";
import { McApiPacket } from "./API/Network/Packets/McApiPacket";
import { McApiLoginPacket } from "./API/Network/Packets/McApiLoginPacket";
import { NetDataWriter } from "./API/Network/NetDataWriter";
import { NetDataReader } from "./API/Network/NetDataReader";
import { Version } from "./API/Data/Version";
import { Z85 } from "./API/Encoders/Z85";

export class McApiMcwss {
  /** @type { Version } */
  #_version = new Version(1, 1, 0);
  /** @type { VoiceCraft } */
  #_vc = new VoiceCraft();
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
    this.#_vc.OnInternalConnectPacket.Subscribe(
      this.#HandleInternalConnectPacket
    );
  }

  /**
   * @param {McApiPacket} packet
   */
  #SendPacket(packet) {
    this.#_writer.Reset();
    this.#_writer.PutByte(packet.packetId);
    packet.Serialize(this.#_writer); //Serialize
    const packetData = Z85.GetStringWithPadding(
      this.#_writer.Data.slice(0, this.#_writer.Length)
    );
    if (packetData.length === 0) return;
    //this.#_source?.sendMessage({ rawtext: [{ text: `${VoiceCraft.#_rawtextPacketId}${packetData}`}] });
    this.#_source?.runCommand(
      `tellraw @s {"rawtext":[{"text":"vc:mcwss_api${packetData}"}]}`
    ); //We have to do it this way because of how the mc client handles chats from different sources.
  }

  /**
   * @param {{ Packet: InternalConnectPacket; Entity?: Entity; }} ev
   */
  #HandleInternalConnectPacket(ev) {
    if (this.#_connecting || ev.Entity === undefined) return;
    this.#_source = ev.Entity;
    const packet = new McApiLoginPacket(ev.Packet.LoginToken, this.#_version);
    this.#SendPacket(packet);
  }
}
