export enum InternalPacketType {
  RequestIdAllocated,
  RequestIdUnallocated,
  Connect,
}

export enum McApiPacketType {
  Login,
  Logout,
  Ping,
  Accept,
  Deny,

  SetEffect,

  //Client Entity Stuff
  Audio,
  SetTitle,
  SetDescription,

  //Entity stuff
  EntityCreated,
  NetworkEntityCreated,
  EntityDestroyed,
  SetVisibility,
  SetName,
  SetMute,
  SetDeafen,
  SetTalkBitmask,
  SetListenBitmask,
  SetEffectBitmask,
  SetPosition,
  SetRotation,
  SetCaveFactor,
  SetMuffleFactor,

  Unknown = 256 //Special handling
}


