import NetSerializable from "./NetSerializable";
import NetDataReader from "./NetDataReader";
import NetDataWriter from "./NetDataWriter";

export const McApiPacketType = Object.freeze({
  unknown: 0,
  login: 1,
  logout: 2,
  ping: 3,
  accept: 4,
  deny: 5,
  setEffect: 6,
  audio: 7,
  setTitle: 8,
  setDescription: 9,
  entityCreated: 10,
  entityDestroyed: 11,
  setName: 12,
  setMute: 13,
  setDeafen: 14,
  setTalkBitmask: 15,
  setListenBitmask: 16,
  setPosition: 17,
  setRotation: 18,
});

export class McApiPacket extends NetSerializable {
  /** @type { Number } */
  packetId = McApiPacketType.unknown;
}

export class LoginPacket extends McApiPacket {
  /** @type { String } */
  loginToken;
  /** @type { Number } */
  major;
  /** @type { Number } */
  minor;
  /** @type { Number } */
  build;

  constructor(loginToken, major, minor, build) {
    super();
    this.packetId = McApiPacketType.login;
    this.loginToken = loginToken;
    this.major = major;
    this.minor = minor;
    this.build = build;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.loginToken);
    writer.putInt(this.major);
    writer.putInt(this.minor);
    writer.putInt(this.build);
  }
}

export class PingPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken = "") {
    super();
    this.packetId = McApiPacketType.ping;
    this.sessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}

export class LogoutPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken = "") {
    super();
    this.packetId = McApiPacketType.logout;
    this.sessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}

export class AcceptPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken = "") {
    super();
    this.packetId = McApiPacketType.accept;
    this.sessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}

export class DenyPacket extends McApiPacket {
  /** @type { String } */
  reasonKey;

  constructor(reasonKey) {
    super();
    this.packetId = McApiPacketType.deny;
    this.reasonKey = reasonKey;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.reasonKey);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.reasonKey = reader.getString();
  }
}

//Set Effect Packet

export class AudioPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;
  /** @type { Number } */
  id;
  /** @type { Number } */
  timeStamp;
  /** @type { Number } */
  frameLoudness;
  /** @type { Number } */
  length;
  /** @type { Uint8Array } */
  data;

  constructor(sessionToken, id, timeStamp, frameLoudness, length, data) {
    super();
    this.packetId = McApiPacketType.audio;
    this.sessionToken = sessionToken;
    this.id = id;
    this.timeStamp = timeStamp;
    this.frameLoudness = frameLoudness;
    this.length = length;
    this.data = data;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
    writer.putInt(this.id);
    writer.putUint(this.timeStamp);
    writer.putFloat(this.frameLoudness);
    //Implement writing raw bytes.
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
    this.id = reader.getInt();
    this.timeStamp = reader.getUint();
    this.frameLoudness = reader.getFloat();
    this.length = reader.availableBytes;
    if(this.length > 1000)
      throw new RangeError(`Array length exceeds maximum number of bytes per packet! Got ${Length} bytes.`);
    this.data = new Uint8Array(this.length);
    //Implement reader raw bytes.
  }
}

export class SetTitlePacket extends McApiPacket {
  /** @type { String } */
  sessionToken;
  /** @type { Number } */
  id;
  /** @type { String } */
  value;


  constructor(sessionToken, id, value) {
    super();
    this.packetId = McApiPacketType.setTitle;
    this.sessionToken = sessionToken;
    this.id = id;
    this.value = value;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
    writer.putInt(this.id);
    writer.putString(this.value);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
    this.id = reader.getInt();
    this.value = reader.getString();
  }
}

export class SetDescriptionPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;
  /** @type { Number } */
  id;
  /** @type { String } */
  value;


  constructor(sessionToken, id, value) {
    super();
    this.packetId = McApiPacketType.setDescription;
    this.sessionToken = sessionToken;
    this.id = id;
    this.value = value;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
    writer.putInt(this.id);
    writer.putString(this.value);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
    this.id = reader.getInt();
    this.value = reader.getString();
  }
}

export class Packet extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken) {
    super();
    this.packetId = McApiPacketType.;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}