export function IsIMcApiPacket(object) {
    return 'PacketType' in object;
}
