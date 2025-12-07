export const enum McApiPacketType {
  //Networking
  Login,
  Logout,
  Ping,
  Accept,
  Deny,


  //Entity stuff
  EntityCreated,
  NetworkEntityCreated
}

export const enum PositioningType {
  Server,
  Client
}