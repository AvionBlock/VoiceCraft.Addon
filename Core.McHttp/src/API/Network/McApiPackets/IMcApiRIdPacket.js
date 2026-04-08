export function IsIMcApiRIdPacket(object) {
    return 'RequestId' in object;
}
