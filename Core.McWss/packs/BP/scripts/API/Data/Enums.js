export var McApiConnectionState;
(function (McApiConnectionState) {
    McApiConnectionState[McApiConnectionState["Disconnected"] = 0] = "Disconnected";
    McApiConnectionState[McApiConnectionState["Connecting"] = 1] = "Connecting";
    McApiConnectionState[McApiConnectionState["Connected"] = 2] = "Connected";
    McApiConnectionState[McApiConnectionState["Disconnecting"] = 3] = "Disconnecting";
})(McApiConnectionState || (McApiConnectionState = {}));
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
    McApiPacketType[McApiPacketType["SetEntityMuteRequest"] = 16] = "SetEntityMuteRequest";
    McApiPacketType[McApiPacketType["SetEntityDeafenRequest"] = 17] = "SetEntityDeafenRequest";
    McApiPacketType[McApiPacketType["SetEntityTalkBitmaskRequest"] = 18] = "SetEntityTalkBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityListenBitmaskRequest"] = 19] = "SetEntityListenBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityEffectBitmaskRequest"] = 20] = "SetEntityEffectBitmaskRequest";
    McApiPacketType[McApiPacketType["SetEntityPositionRequest"] = 21] = "SetEntityPositionRequest";
    McApiPacketType[McApiPacketType["SetEntityRotationRequest"] = 22] = "SetEntityRotationRequest";
    McApiPacketType[McApiPacketType["SetEntityCaveFactorRequest"] = 23] = "SetEntityCaveFactorRequest";
    McApiPacketType[McApiPacketType["SetEntityMuffleFactorRequest"] = 24] = "SetEntityMuffleFactorRequest";
    //Responses
    McApiPacketType[McApiPacketType["ResetResponse"] = 25] = "ResetResponse";
    McApiPacketType[McApiPacketType["CreateEntityResponse"] = 26] = "CreateEntityResponse";
    McApiPacketType[McApiPacketType["DestroyEntityResponse"] = 27] = "DestroyEntityResponse";
    //Events
    McApiPacketType[McApiPacketType["OnEffectUpdated"] = 28] = "OnEffectUpdated";
    McApiPacketType[McApiPacketType["OnEntityCreated"] = 29] = "OnEntityCreated";
    McApiPacketType[McApiPacketType["OnNetworkEntityCreated"] = 30] = "OnNetworkEntityCreated";
    McApiPacketType[McApiPacketType["OnEntityDestroyed"] = 31] = "OnEntityDestroyed";
    McApiPacketType[McApiPacketType["OnEntityVisibilityUpdated"] = 32] = "OnEntityVisibilityUpdated";
    McApiPacketType[McApiPacketType["OnEntityWorldIdUpdated"] = 33] = "OnEntityWorldIdUpdated";
    McApiPacketType[McApiPacketType["OnEntityNameUpdated"] = 34] = "OnEntityNameUpdated";
    McApiPacketType[McApiPacketType["OnEntityMuteUpdated"] = 35] = "OnEntityMuteUpdated";
    McApiPacketType[McApiPacketType["OnEntityDeafenUpdated"] = 36] = "OnEntityDeafenUpdated";
    McApiPacketType[McApiPacketType["OnEntityServerMuteUpdated"] = 37] = "OnEntityServerMuteUpdated";
    McApiPacketType[McApiPacketType["OnEntityServerDeafenUpdated"] = 38] = "OnEntityServerDeafenUpdated";
    McApiPacketType[McApiPacketType["OnEntityTalkBitmaskUpdated"] = 39] = "OnEntityTalkBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityListenBitmaskUpdated"] = 40] = "OnEntityListenBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityEffectBitmaskUpdated"] = 41] = "OnEntityEffectBitmaskUpdated";
    McApiPacketType[McApiPacketType["OnEntityPositionUpdated"] = 42] = "OnEntityPositionUpdated";
    McApiPacketType[McApiPacketType["OnEntityRotationUpdated"] = 43] = "OnEntityRotationUpdated";
    McApiPacketType[McApiPacketType["OnEntityCaveFactorUpdated"] = 44] = "OnEntityCaveFactorUpdated";
    McApiPacketType[McApiPacketType["OnEntityMuffleFactorUpdated"] = 45] = "OnEntityMuffleFactorUpdated";
    McApiPacketType[McApiPacketType["OnEntityAudioReceived"] = 46] = "OnEntityAudioReceived";
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
