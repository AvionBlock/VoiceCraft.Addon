export var McApiPacketType;
(function (McApiPacketType) {
    //Requests
    McApiPacketType[McApiPacketType["LoginRequest"] = 0] = "LoginRequest";
    McApiPacketType[McApiPacketType["LogoutRequest"] = 1] = "LogoutRequest";
    McApiPacketType[McApiPacketType["PingRequest"] = 2] = "PingRequest";
    McApiPacketType[McApiPacketType["SetEffectRequest"] = 3] = "SetEffectRequest";
    McApiPacketType[McApiPacketType["ClearEffectsRequest"] = 4] = "ClearEffectsRequest";
    McApiPacketType[McApiPacketType["SetEntityTitleRequest"] = 5] = "SetEntityTitleRequest";
    McApiPacketType[McApiPacketType["SetEntityDescriptionRequest"] = 6] = "SetEntityDescriptionRequest";
    McApiPacketType[McApiPacketType["SetEntityWorldIdRequest"] = 7] = "SetEntityWorldIdRequest";
    McApiPacketType[McApiPacketType["SetEntityNameRequest"] = 8] = "SetEntityNameRequest";
    McApiPacketType[McApiPacketType["SetEntityTalkBitmaskRequest"] = 9] = "SetEntityTalkBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityListenBitmaskRequest"] = 10] = "SetEntityListenBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityEffectBitmaskRequest"] = 11] = "SetEntityEffectBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityPositionRequest"] = 12] = "SetEntityPositionRequest";
    McApiPacketType[McApiPacketType["SetEntityRotationRequest"] = 13] = "SetEntityRotationRequest";
    McApiPacketType[McApiPacketType["SetEntityCaveFactorRequest"] = 14] = "SetEntityCaveFactorRequest";
    McApiPacketType[McApiPacketType["SetEntityMuffleFactorRequest"] = 15] = "SetEntityMuffleFactorRequest";
    //Responses
    McApiPacketType[McApiPacketType["AcceptResponse"] = 16] = "AcceptResponse";
    McApiPacketType[McApiPacketType["DenyResponse"] = 17] = "DenyResponse";
    McApiPacketType[McApiPacketType["PingResponse"] = 18] = "PingResponse";
    //Events
    McApiPacketType[McApiPacketType["OnEffectUpdated"] = 19] = "OnEffectUpdated";
    McApiPacketType[McApiPacketType["OnEntityCreated"] = 20] = "OnEntityCreated";
    McApiPacketType[McApiPacketType["OnNetworkEntityCreated"] = 21] = "OnNetworkEntityCreated";
    McApiPacketType[McApiPacketType["OnEntityDestroyed"] = 22] = "OnEntityDestroyed";
    McApiPacketType[McApiPacketType["OnEntityVisibilityUpdated"] = 23] = "OnEntityVisibilityUpdated";
    McApiPacketType[McApiPacketType["OnEntityWorldIdUpdated"] = 24] = "OnEntityWorldIdUpdated";
    McApiPacketType[McApiPacketType["OnEntityNameUpdated"] = 25] = "OnEntityNameUpdated";
    McApiPacketType[McApiPacketType["OnEntityMuteUpdated"] = 26] = "OnEntityMuteUpdated";
    McApiPacketType[McApiPacketType["OnEntityDeafenUpdated"] = 27] = "OnEntityDeafenUpdated";
    McApiPacketType[McApiPacketType["OnEntityTalkBitmaskUpdated"] = 28] = "OnEntityTalkBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityListenBitmaskUpdated"] = 29] = "OnEntityListenBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityEffectBitmaskUpdated"] = 30] = "OnEntityEffectBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityPositionUpdated"] = 31] = "OnEntityPositionUpdated";
    McApiPacketType[McApiPacketType["OnEntityRotationUpdated"] = 32] = "OnEntityRotationUpdated";
    McApiPacketType[McApiPacketType["OnEntityCaveFactorUpdated"] = 33] = "OnEntityCaveFactorUpdated";
    McApiPacketType[McApiPacketType["OnEntityMuffleFactorUpdated"] = 34] = "OnEntityMuffleFactorUpdated";
    McApiPacketType[McApiPacketType["OnEntityAudioReceived"] = 35] = "OnEntityAudioReceived";
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
})(EffectType || (EffectType = {}));
