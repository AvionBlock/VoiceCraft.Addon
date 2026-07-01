export declare enum McApiConnectionState {
    Disconnected = 0,
    Connecting = 1,
    Connected = 2,
    Disconnecting = 3
}
export declare enum PositioningType {
    Server = 0,
    Client = 1
}
export declare enum EffectType {
    None = 0,
    Visibility = 1,
    Proximity = 2,
    Directional = 3,
    ProximityEcho = 4,
    Echo = 5,
    ProximityMuffle = 6,
    Muffle = 7
}
export declare enum PropertyType {
    Null = 0,
    Boolean = 1,
    SByte = 2,
    Byte = 3,
    Short = 4,
    UShort = 5,
    Int = 6,
    UInt = 7,
    Long = 8,
    ULong = 9,
    Float = 10,
    Double = 11
}
export declare enum EventType {
    None = 0,
    OnEffectUpdated = 1,
    OnEntityCreated = 2,
    OnNetworkEntityCreated = 3,
    OnEntityDestroyed = 4,
    OnEntityVisibilityUpdated = 5,
    OnEntityWorldIdUpdated = 6,
    OnEntityNameUpdated = 7,
    OnEntityMuteUpdated = 8,
    OnEntityDeafenUpdated = 9,
    OnEntityServerMuteUpdated = 10,
    OnEntityServerDeafenUpdated = 11,
    OnEntityTalkBitmaskUpdated = 12,
    OnEntityListenBitmaskUpdated = 13,
    OnEntityEffectBitmaskUpdated = 14,
    OnEntityPositionUpdated = 15,
    OnEntityRotationUpdated = 16,
    OnEntityPropertyUpdated = 17,
    OnEntityAudioReceived = 18,
    OnEntityAudioDataReceived = 19
}
export declare enum McApiPacketType {
    LoginRequest = 0,
    LogoutRequest = 1,
    PingRequest = 2,
    AcceptResponse = 3,
    DenyResponse = 4,
    PingResponse = 5,
    EventRequest = 6,
    ResetRequest = 7,
    SetEffectRequest = 8,
    ClearEffectsRequest = 9,
    CreateEntityRequest = 10,
    DestroyEntityRequest = 11,
    EntityAudioRequest = 12,
    SetEntityTitleRequest = 13,
    SetEntityDescriptionRequest = 14,
    SetEntityWorldIdRequest = 15,
    SetEntityNameRequest = 16,
    SetEntityMuteRequest = 17,
    SetEntityDeafenRequest = 18,
    SetEntityTalkBitmaskRequest = 19,
    SetEntityListenBitmaskRequest = 20,
    SetEntityEffectBitmaskRequest = 21,
    SetEntityPositionRequest = 22,
    SetEntityRotationRequest = 23,
    SetEntityPropertyRequest = 24,
    ResetResponse = 25,
    CreateEntityResponse = 26,
    DestroyEntityResponse = 27
}
