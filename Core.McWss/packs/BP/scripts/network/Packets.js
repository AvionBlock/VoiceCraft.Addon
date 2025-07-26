import NetDataReader from "./NetDataReader";
import NetDataWriter from "./NetDataWriter";

export const McApiPacketType = Object.freeze({
  Unknown: 0,
  Login: 1,
  Logout: 2,
  Ping: 3,
  Accept: 4,
  Deny: 5,
});

export class McApiPacket {
  /** @type { Number } */
  packetId = McApiPacketType.Unknown;

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
    this.packetId = McApiPacketType.Login;
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
    this.packetId = McApiPacketType.Ping;
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
    this.packetId = McApiPacketType.Ping;
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
    this.packetId = McApiPacketType.Accept;
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
    this.packetId = McApiPacketType.Deny;
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
