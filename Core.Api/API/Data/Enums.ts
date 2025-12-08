export const enum McApiPacketType {
  //Requests
  LoginRequest,
  LogoutRequest,
  PingRequest,

  //Responses
  AcceptResponse,
  DenyResponse,
  PingResponse,

  //Events
  OnEntityCreated,
  OnNetworkEntityCreated,
  OnEntityDestroyed,
  OnEntityVisibilityUpdated,
  OnEntityWorldIdUpdated,
  OnEntityNameUpdated,
  OnEntityMuteUpdated,
  OnEntityDeafenUpdated,
  OnEntityTalkBitmaskUpdated,
  OnEntityListenBitmaskUpdated,
  OnEntityEffectBitmaskUpdated,
  OnEntityPositionUpdated,
  OnEntityRotationUpdated,
  OnEntityCaveFactorUpdated,
  OnEntityMuffleFactorUpdated,
  OnEntityAudioReceived,
}

export const enum PositioningType {
  Server,
  Client,
}
