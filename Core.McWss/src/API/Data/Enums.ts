export enum McApiConnectionState {
    Disconnected,
    Connecting,
    Connected,
    Disconnecting
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

export enum PropertyType {

    Null,
    Boolean,
    SByte,
    Byte,
    Short,
    UShort,
    Int,
    UInt,
    Long,
    ULong,
    Float,
    Double
}

export enum EventType {
    None,
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
    OnEntityPropertyUpdated,
    OnEntityAudioReceived,
    OnEntityAudioDataReceived,
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
    EventRequest,
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
    SetEntityPropertyRequest,

    //Responses
    ResetResponse,
    CreateEntityResponse,
    DestroyEntityResponse,
}