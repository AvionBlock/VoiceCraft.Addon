export function IsIMcApiEventPacket(object) {
    return 'EventType' in object;
}
