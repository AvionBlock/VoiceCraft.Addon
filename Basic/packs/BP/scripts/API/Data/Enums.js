export var InternalPacketType;
(function (InternalPacketType) {
    InternalPacketType[InternalPacketType["RequestIdAllocated"] = 0] = "RequestIdAllocated";
    InternalPacketType[InternalPacketType["RequestIdUnallocated"] = 1] = "RequestIdUnallocated";
    InternalPacketType[InternalPacketType["Connect"] = 2] = "Connect";
})(InternalPacketType || (InternalPacketType = {}));
export var McApiPacketType;
(function (McApiPacketType) {
    McApiPacketType[McApiPacketType["Login"] = 0] = "Login";
    McApiPacketType[McApiPacketType["Logout"] = 1] = "Logout";
    McApiPacketType[McApiPacketType["Ping"] = 2] = "Ping";
    McApiPacketType[McApiPacketType["Accept"] = 3] = "Accept";
    McApiPacketType[McApiPacketType["Deny"] = 4] = "Deny";
    McApiPacketType[McApiPacketType["SetEffect"] = 5] = "SetEffect";
    //Client Entity Stuff
    McApiPacketType[McApiPacketType["Audio"] = 6] = "Audio";
    McApiPacketType[McApiPacketType["SetTitle"] = 7] = "SetTitle";
    McApiPacketType[McApiPacketType["SetDescription"] = 8] = "SetDescription";
    //Entity stuff
    McApiPacketType[McApiPacketType["EntityCreated"] = 9] = "EntityCreated";
    McApiPacketType[McApiPacketType["NetworkEntityCreated"] = 10] = "NetworkEntityCreated";
    McApiPacketType[McApiPacketType["EntityDestroyed"] = 11] = "EntityDestroyed";
    McApiPacketType[McApiPacketType["SetVisibility"] = 12] = "SetVisibility";
    McApiPacketType[McApiPacketType["SetName"] = 13] = "SetName";
    McApiPacketType[McApiPacketType["SetMute"] = 14] = "SetMute";
    McApiPacketType[McApiPacketType["SetDeafen"] = 15] = "SetDeafen";
    McApiPacketType[McApiPacketType["SetTalkBitmask"] = 16] = "SetTalkBitmask";
    McApiPacketType[McApiPacketType["SetListenBitmask"] = 17] = "SetListenBitmask";
    McApiPacketType[McApiPacketType["SetEffectBitmask"] = 18] = "SetEffectBitmask";
    McApiPacketType[McApiPacketType["SetPosition"] = 19] = "SetPosition";
    McApiPacketType[McApiPacketType["SetRotation"] = 20] = "SetRotation";
    McApiPacketType[McApiPacketType["SetCaveFactor"] = 21] = "SetCaveFactor";
    McApiPacketType[McApiPacketType["SetMuffleFactor"] = 22] = "SetMuffleFactor";
    McApiPacketType[McApiPacketType["Unknown"] = 256] = "Unknown"; //Special handling
})(McApiPacketType || (McApiPacketType = {}));
