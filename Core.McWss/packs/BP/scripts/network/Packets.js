import NetDataReader from "./NetDataReader";
import NetDataWriter from "./NetDataWriter";

export const McApiPacketType = Object.freeze({
  unknown: 0,
  login: 1,
  logout: 2,
  ping: 3,
  accept: 4,
  deny: 5,
});

export class McApiPacket {
  /** @type { Number } */
  packetId = McApiPacketType.unknown;

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {}

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {}
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
