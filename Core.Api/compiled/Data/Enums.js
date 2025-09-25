export var InternalPacketType;
(function (InternalPacketType) {
    InternalPacketType[InternalPacketType["Connect"] = 0] = "Connect";
})(InternalPacketType || (InternalPacketType = {}));
export var McApiPacketType;
(function (McApiPacketType) {
    McApiPacketType[McApiPacketType["Login"] = 0] = "Login";
    McApiPacketType[McApiPacketType["Logout"] = 1] = "Logout";
    McApiPacketType[McApiPacketType["Ping"] = 2] = "Ping";
    McApiPacketType[McApiPacketType["Accept"] = 3] = "Accept";
    McApiPacketType[McApiPacketType["Deny"] = 4] = "Deny";
    McApiPacketType[McApiPacketType["Unknown"] = 256] = "Unknown"; //Special handling
})(McApiPacketType || (McApiPacketType = {}));
