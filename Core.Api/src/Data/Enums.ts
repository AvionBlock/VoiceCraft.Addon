export enum InternalPacketType {
  Connect
}

export enum McApiPacketType {
  Login,
  Logout,
  Ping,
  Accept,
  Deny,

  Unknown = 256 //Special handling
}
