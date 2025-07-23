import NetDataReader from "./NetDataReader";
import NetDataWriter from "./NetDataWriter";

const McApiPacketType = Object.freeze({
  Unknown: 0,
  Login: 1,
  Logout: 2,
  Ping: 3,
  Accept: 4,
  Deny: 5,
});

class McApiPacket {
  /** @type { Number } */
  PacketId = McApiPacketType.Unknown;

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {}

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {}
}

class LoginPacket extends McApiPacket {
  /** @type { String } */
  LoginToken;
  /** @type { Number } */
  Major;
  /** @type { Number } */
  Minor;
  /** @type { Number } */
  Build;

  constructor(loginToken, major, minor, build) {
    super();
    this.PacketId = McApiPacketType.Login;
    this.LoginToken = loginToken;
    this.Major = major;
    this.Minor = minor;
    this.Build = build;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.LoginToken);
    writer.putInt(this.Major);
    writer.putInt(this.Minor);
    writer.putInt(this.Build);
  }
}

class PingPacket extends McApiPacket {
  /** @type { String } */
  SessionToken;

  constructor(sessionToken) {
    super();
    this.PacketId = McApiPacketType.Ping;
    this.SessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.SessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.SessionToken = reader.getString();
  }
}

class AcceptPacket extends McApiPacket {
  /** @type { String } */
  SessionToken;

  constructor(sessionToken) {
    super();
    this.PacketId = McApiPacketType.Accept;
    this.SessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.SessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.SessionToken = reader.getString();
  }
}

export { McApiPacketType, McApiPacket, LoginPacket, PingPacket, AcceptPacket };
