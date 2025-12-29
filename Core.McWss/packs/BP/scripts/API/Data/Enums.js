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
    McApiPacketType[McApiPacketType["ResetRequest"] = 6] = "ResetRequest";
    McApiPacketType[McApiPacketType["SetEffectRequest"] = 7] = "SetEffectRequest";
    McApiPacketType[McApiPacketType["ClearEffectsRequest"] = 8] = "ClearEffectsRequest";
    McApiPacketType[McApiPacketType["CreateEntityRequest"] = 9] = "CreateEntityRequest";
    McApiPacketType[McApiPacketType["DestroyEntityRequest"] = 10] = "DestroyEntityRequest";
    McApiPacketType[McApiPacketType["EntityAudioRequest"] = 11] = "EntityAudioRequest";
    McApiPacketType[McApiPacketType["SetEntityTitleRequest"] = 12] = "SetEntityTitleRequest";
    McApiPacketType[McApiPacketType["SetEntityDescriptionRequest"] = 13] = "SetEntityDescriptionRequest";
    McApiPacketType[McApiPacketType["SetEntityWorldIdRequest"] = 14] = "SetEntityWorldIdRequest";
    McApiPacketType[McApiPacketType["SetEntityNameRequest"] = 15] = "SetEntityNameRequest";
    McApiPacketType[McApiPacketType["SetEntityTalkBitmaskRequest"] = 16] = "SetEntityTalkBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityListenBitmaskRequest"] = 17] = "SetEntityListenBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityEffectBitmaskRequest"] = 18] = "SetEntityEffectBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityPositionRequest"] = 19] = "SetEntityPositionRequest";
    McApiPacketType[McApiPacketType["SetEntityRotationRequest"] = 20] = "SetEntityRotationRequest";
    McApiPacketType[McApiPacketType["SetEntityCaveFactorRequest"] = 21] = "SetEntityCaveFactorRequest";
    McApiPacketType[McApiPacketType["SetEntityMuffleFactorRequest"] = 22] = "SetEntityMuffleFactorRequest";
    //Responses
    McApiPacketType[McApiPacketType["ResetResponse"] = 23] = "ResetResponse";
    McApiPacketType[McApiPacketType["CreateEntityResponse"] = 24] = "CreateEntityResponse";
    McApiPacketType[McApiPacketType["DestroyEntityResponse"] = 25] = "DestroyEntityResponse";
    //Events
    McApiPacketType[McApiPacketType["OnEffectUpdated"] = 26] = "OnEffectUpdated";
    McApiPacketType[McApiPacketType["OnEntityCreated"] = 27] = "OnEntityCreated";
    McApiPacketType[McApiPacketType["OnNetworkEntityCreated"] = 28] = "OnNetworkEntityCreated";
    McApiPacketType[McApiPacketType["OnEntityDestroyed"] = 29] = "OnEntityDestroyed";
    McApiPacketType[McApiPacketType["OnEntityVisibilityUpdated"] = 30] = "OnEntityVisibilityUpdated";
    McApiPacketType[McApiPacketType["OnEntityWorldIdUpdated"] = 31] = "OnEntityWorldIdUpdated";
    McApiPacketType[McApiPacketType["OnEntityNameUpdated"] = 32] = "OnEntityNameUpdated";
    McApiPacketType[McApiPacketType["OnEntityMuteUpdated"] = 33] = "OnEntityMuteUpdated";
    McApiPacketType[McApiPacketType["OnEntityDeafenUpdated"] = 34] = "OnEntityDeafenUpdated";
    McApiPacketType[McApiPacketType["OnEntityTalkBitmaskUpdated"] = 35] = "OnEntityTalkBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityListenBitmaskUpdated"] = 36] = "OnEntityListenBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityEffectBitmaskUpdated"] = 37] = "OnEntityEffectBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityPositionUpdated"] = 38] = "OnEntityPositionUpdated";
    McApiPacketType[McApiPacketType["OnEntityRotationUpdated"] = 39] = "OnEntityRotationUpdated";
    McApiPacketType[McApiPacketType["OnEntityCaveFactorUpdated"] = 40] = "OnEntityCaveFactorUpdated";
    McApiPacketType[McApiPacketType["OnEntityMuffleFactorUpdated"] = 41] = "OnEntityMuffleFactorUpdated";
    McApiPacketType[McApiPacketType["OnEntityAudioReceived"] = 42] = "OnEntityAudioReceived";
})(McApiPacketType || (McApiPacketType = {}));
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
