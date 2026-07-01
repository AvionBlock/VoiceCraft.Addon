export var McApiConnectionState;
(function (McApiConnectionState) {
    McApiConnectionState[McApiConnectionState["Disconnected"] = 0] = "Disconnected";
    McApiConnectionState[McApiConnectionState["Connecting"] = 1] = "Connecting";
    McApiConnectionState[McApiConnectionState["Connected"] = 2] = "Connected";
    McApiConnectionState[McApiConnectionState["Disconnecting"] = 3] = "Disconnecting";
})(McApiConnectionState || (McApiConnectionState = {}));
export var PositioningType;
(function (PositioningType) {
    PositioningType[PositioningType["Server"] = 0] = "Server";
    PositioningType[PositioningType["Client"] = 1] = "Client";
})(PositioningType || (PositioningType = {}));
export var EffectType;
(function (EffectType) {
    EffectType[EffectType["None"] = 0] = "None";
    EffectType[EffectType["Visibility"] = 1] = "Visibility";
    EffectType[EffectType["Proximity"] = 2] = "Proximity";
    EffectType[EffectType["Directional"] = 3] = "Directional";
    EffectType[EffectType["ProximityEcho"] = 4] = "ProximityEcho";
    EffectType[EffectType["Echo"] = 5] = "Echo";
    EffectType[EffectType["ProximityMuffle"] = 6] = "ProximityMuffle";
    EffectType[EffectType["Muffle"] = 7] = "Muffle";
})(EffectType || (EffectType = {}));
export var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["Null"] = 0] = "Null";
    PropertyType[PropertyType["Boolean"] = 1] = "Boolean";
    PropertyType[PropertyType["SByte"] = 2] = "SByte";
    PropertyType[PropertyType["Byte"] = 3] = "Byte";
    PropertyType[PropertyType["Short"] = 4] = "Short";
    PropertyType[PropertyType["UShort"] = 5] = "UShort";
    PropertyType[PropertyType["Int"] = 6] = "Int";
    PropertyType[PropertyType["UInt"] = 7] = "UInt";
    PropertyType[PropertyType["Long"] = 8] = "Long";
    PropertyType[PropertyType["ULong"] = 9] = "ULong";
    PropertyType[PropertyType["Float"] = 10] = "Float";
    PropertyType[PropertyType["Double"] = 11] = "Double";
})(PropertyType || (PropertyType = {}));
export var EventType;
(function (EventType) {
    EventType[EventType["None"] = 0] = "None";
    EventType[EventType["OnEffectUpdated"] = 1] = "OnEffectUpdated";
    EventType[EventType["OnEntityCreated"] = 2] = "OnEntityCreated";
    EventType[EventType["OnNetworkEntityCreated"] = 3] = "OnNetworkEntityCreated";
    EventType[EventType["OnEntityDestroyed"] = 4] = "OnEntityDestroyed";
    EventType[EventType["OnEntityVisibilityUpdated"] = 5] = "OnEntityVisibilityUpdated";
    EventType[EventType["OnEntityWorldIdUpdated"] = 6] = "OnEntityWorldIdUpdated";
    EventType[EventType["OnEntityNameUpdated"] = 7] = "OnEntityNameUpdated";
    EventType[EventType["OnEntityMuteUpdated"] = 8] = "OnEntityMuteUpdated";
    EventType[EventType["OnEntityDeafenUpdated"] = 9] = "OnEntityDeafenUpdated";
    EventType[EventType["OnEntityServerMuteUpdated"] = 10] = "OnEntityServerMuteUpdated";
    EventType[EventType["OnEntityServerDeafenUpdated"] = 11] = "OnEntityServerDeafenUpdated";
    EventType[EventType["OnEntityTalkBitmaskUpdated"] = 12] = "OnEntityTalkBitmaskUpdated";
    EventType[EventType["OnEntityListenBitmaskUpdated"] = 13] = "OnEntityListenBitmaskUpdated";
    EventType[EventType["OnEntityEffectBitmaskUpdated"] = 14] = "OnEntityEffectBitmaskUpdated";
    EventType[EventType["OnEntityPositionUpdated"] = 15] = "OnEntityPositionUpdated";
    EventType[EventType["OnEntityRotationUpdated"] = 16] = "OnEntityRotationUpdated";
    EventType[EventType["OnEntityPropertyUpdated"] = 17] = "OnEntityPropertyUpdated";
    EventType[EventType["OnEntityAudioReceived"] = 18] = "OnEntityAudioReceived";
    EventType[EventType["OnEntityAudioDataReceived"] = 19] = "OnEntityAudioDataReceived";
})(EventType || (EventType = {}));
export var McApiPacketType;
(function (McApiPacketType) {
    //Core
    //Requests DO NOT CHANGE!
    McApiPacketType[McApiPacketType["LoginRequest"] = 0] = "LoginRequest";
    McApiPacketType[McApiPacketType["LogoutRequest"] = 1] = "LogoutRequest";
    McApiPacketType[McApiPacketType["PingRequest"] = 2] = "PingRequest";
    //Responses DO NOT CHANGE!
    McApiPacketType[McApiPacketType["AcceptResponse"] = 3] = "AcceptResponse";
    McApiPacketType[McApiPacketType["DenyResponse"] = 4] = "DenyResponse";
    McApiPacketType[McApiPacketType["PingResponse"] = 5] = "PingResponse";
    //Other/Changeable
    //Requests
    McApiPacketType[McApiPacketType["EventRequest"] = 6] = "EventRequest";
    McApiPacketType[McApiPacketType["ResetRequest"] = 7] = "ResetRequest";
    McApiPacketType[McApiPacketType["SetEffectRequest"] = 8] = "SetEffectRequest";
    McApiPacketType[McApiPacketType["ClearEffectsRequest"] = 9] = "ClearEffectsRequest";
    McApiPacketType[McApiPacketType["CreateEntityRequest"] = 10] = "CreateEntityRequest";
    McApiPacketType[McApiPacketType["DestroyEntityRequest"] = 11] = "DestroyEntityRequest";
    McApiPacketType[McApiPacketType["EntityAudioRequest"] = 12] = "EntityAudioRequest";
    McApiPacketType[McApiPacketType["SetEntityTitleRequest"] = 13] = "SetEntityTitleRequest";
    McApiPacketType[McApiPacketType["SetEntityDescriptionRequest"] = 14] = "SetEntityDescriptionRequest";
    McApiPacketType[McApiPacketType["SetEntityWorldIdRequest"] = 15] = "SetEntityWorldIdRequest";
    McApiPacketType[McApiPacketType["SetEntityNameRequest"] = 16] = "SetEntityNameRequest";
    McApiPacketType[McApiPacketType["SetEntityMuteRequest"] = 17] = "SetEntityMuteRequest";
    McApiPacketType[McApiPacketType["SetEntityDeafenRequest"] = 18] = "SetEntityDeafenRequest";
    McApiPacketType[McApiPacketType["SetEntityTalkBitmaskRequest"] = 19] = "SetEntityTalkBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityListenBitmaskRequest"] = 20] = "SetEntityListenBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityEffectBitmaskRequest"] = 21] = "SetEntityEffectBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityPositionRequest"] = 22] = "SetEntityPositionRequest";
    McApiPacketType[McApiPacketType["SetEntityRotationRequest"] = 23] = "SetEntityRotationRequest";
    McApiPacketType[McApiPacketType["SetEntityPropertyRequest"] = 24] = "SetEntityPropertyRequest";
    //Responses
    McApiPacketType[McApiPacketType["ResetResponse"] = 25] = "ResetResponse";
    McApiPacketType[McApiPacketType["CreateEntityResponse"] = 26] = "CreateEntityResponse";
    McApiPacketType[McApiPacketType["DestroyEntityResponse"] = 27] = "DestroyEntityResponse";
})(McApiPacketType || (McApiPacketType = {}));
