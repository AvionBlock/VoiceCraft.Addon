export enum McApiConnectionState {
    Disconnected,
    Connecting,
    Connected,
    Disconnecting
}

export enum McApiPacketType {
    //Core
    //Requests DO NOT CHANGE!
    LoginRequest,
    LogoutRequest,
    PingRequest,
    //Responses DO NOT CHANGE!
    AcceptResponse,
    DenyResponse,
    PingResponse,

    //Other/Changeable
    //Requests
    ResetRequest,
    SetEffectRequest,
    ClearEffectsRequest,
    CreateEntityRequest,
    DestroyEntityRequest,
    EntityAudioRequest,
    SetEntityTitleRequest,
    SetEntityDescriptionRequest,
    SetEntityWorldIdRequest,
    SetEntityNameRequest,
    SetEntityMuteRequest,
    SetEntityDeafenRequest,
    SetEntityTalkBitmaskRequest,
    SetEntityListenBitmaskRequest,
    SetEntityEffectBitmaskRequest,
    SetEntityPositionRequest,
    SetEntityRotationRequest,
    SetEntityCaveFactorRequest,
    SetEntityMuffleFactorRequest,

    //Responses
    ResetResponse,
    CreateEntityResponse,
    DestroyEntityResponse,

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
    OnEntityServerMuteUpdated,
    OnEntityServerDeafenUpdated,
    OnEntityTalkBitmaskUpdated,
    OnEntityListenBitmaskUpdated,
    OnEntityEffectBitmaskUpdated,
    OnEntityPositionUpdated,
    OnEntityRotationUpdated,
    OnEntityCaveFactorUpdated,
    OnEntityMuffleFactorUpdated,
    OnEntityAudioReceived
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
    Echo,
    ProximityMuffle,
    Muffle,
}