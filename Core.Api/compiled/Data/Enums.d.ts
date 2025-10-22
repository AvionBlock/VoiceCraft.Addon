export declare enum InternalPacketType {
    RequestIdAllocated = 0,
    RequestIdUnallocated = 1,
    Connect = 2
}
export declare enum McApiPacketType {
    Login = 0,
    Logout = 1,
    Ping = 2,
    Accept = 3,
    Deny = 4,
    SetEffect = 5,
    Audio = 6,
    SetTitle = 7,
    SetDescription = 8,
    EntityCreated = 9,
    NetworkEntityCreated = 10,
    EntityDestroyed = 11,
    SetVisibility = 12,
    SetName = 13,
    SetMute = 14,
    SetDeafen = 15,
    SetTalkBitmask = 16,
    SetListenBitmask = 17,
    SetEffectBitmask = 18,
    SetPosition = 19,
    SetRotation = 20,
    SetCaveFactor = 21,
    SetMuffleFactor = 22,
    Unknown = 256
}
