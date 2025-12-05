export var McApiPacketType;
(function (McApiPacketType) {
    //Networking
    McApiPacketType[McApiPacketType["Login"] = 0] = "Login";
    McApiPacketType[McApiPacketType["Logout"] = 1] = "Logout";
    McApiPacketType[McApiPacketType["Ping"] = 2] = "Ping";
    McApiPacketType[McApiPacketType["Accept"] = 3] = "Accept";
    McApiPacketType[McApiPacketType["Deny"] = 4] = "Deny";
    //Entity stuff
    McApiPacketType[McApiPacketType["EntityCreated"] = 5] = "EntityCreated";
    McApiPacketType[McApiPacketType["NetworkEntityCreated"] = 6] = "NetworkEntityCreated";
})(McApiPacketType || (McApiPacketType = {}));
export var PositioningType;
(function (PositioningType) {
    PositioningType[PositioningType["Server"] = 0] = "Server";
    PositioningType[PositioningType["Client"] = 1] = "Client";
})(PositioningType || (PositioningType = {}));
