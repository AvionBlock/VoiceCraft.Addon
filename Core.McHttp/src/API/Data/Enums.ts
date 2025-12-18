export enum McApiPacketType {
    //Requests
    LoginRequest,
    LogoutRequest,
    PingRequest,
    SetEffectRequest,
    ClearEffectsRequest,
    SetEntityTitleRequest,
    SetEntityDescriptionRequest,
    SetEntityWorldIdRequest,
    SetEntityNameRequest,
    SetEntityTalkBitmaskRequest,
    SetEntityListenBitmaskRequest,
    SetEntityEffectBitmaskRequest,
    SetEntityPositionRequest,
    SetEntityRotationRequest,
    SetEntityCaveFactorRequest,
    SetEntityMuffleFactorRequest,

    //Responses
    AcceptResponse,
    DenyResponse,
    PingResponse,

    //Events
    OnEffectUpdated,
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

export enum PositioningType {
    Server,
    Client,
}

export enum EffectType {
    None,
    Visibility,
    Proximity,
    Directional,
    ProximityEcho,
    Echo
}