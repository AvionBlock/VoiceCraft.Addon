export enum McApiPacketType {
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

export enum PositioningType {
  Server,
  Client
}