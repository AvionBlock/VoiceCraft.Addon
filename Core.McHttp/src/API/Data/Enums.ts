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
    Echo
}