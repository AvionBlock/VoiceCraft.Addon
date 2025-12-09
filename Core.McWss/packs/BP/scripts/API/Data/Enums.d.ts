export declare const enum McApiPacketType {
    LoginRequest = 0,
    LogoutRequest = 1,
    PingRequest = 2,
    SetEntityTitleRequest = 3,
    SetEntityDescriptionRequest = 4,
    AcceptResponse = 5,
    DenyResponse = 6,
    PingResponse = 7,
    OnEntityCreated = 8,
    OnNetworkEntityCreated = 9,
    OnEntityDestroyed = 10,
    OnEntityVisibilityUpdated = 11,
    OnEntityWorldIdUpdated = 12,
    OnEntityNameUpdated = 13,
    OnEntityMuteUpdated = 14,
    OnEntityDeafenUpdated = 15,
    OnEntityTalkBitmaskUpdated = 16,
    OnEntityListenBitmaskUpdated = 17,
    OnEntityEffectBitmaskUpdated = 18,
    OnEntityPositionUpdated = 19,
    OnEntityRotationUpdated = 20,
    OnEntityCaveFactorUpdated = 21,
    OnEntityMuffleFactorUpdated = 22,
    OnEntityAudioReceived = 23
}
export declare const enum PositioningType {
    Server = 0,
    Client = 1
}
