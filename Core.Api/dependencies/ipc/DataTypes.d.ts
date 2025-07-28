import { PacketHandle, TypeHandle } from "./Handle";

/**
 * This Enumeration represents all the default types that are implemented in the protocol
 */
export enum DataTypes {
    // Base Type: Byte / Char
    Char = 0, // XXXX-XXXX

    // Signed Numbers
    Int8 = 1,
    Int16 = 2,
    Int32 = 3,
    SignedVarInt = 4,
    
    // Unsigned Numbers
    Unsigned = 5,
    UnsignedInt8 = 6,
    UnsignedInt16 = 7,
    UnsignedInt32 = 8,
    VarInt = 9, // XXXX-XXXC

    Float32 = 10,
    Float64 = 11,

    // Miscellanious
    Boolean = 12, // X000-0000
    BooleanGroup = 12, // ABCD-EFGH  |  Each bit is a bool value. If there are multiple bool values the system will automatically make it to a bool group // EDIT: Gave both values the same num as their impl can be identical
    StringLiteral = 13, // XXXX-XXXX XXXX-XXXX ...CCCC CCCC  |  X = 16 bit length indicator int, C = Character byte

    // Lists
    ByteArray = 14, // XXXX-XXXX CCCC-CCCC[?]  |  X = 8 bit integer element length declaration, C = Raw Byte data
    Array = 15, // <VARINT> C[?]  |  Prefixed by a varint indicating the length of the array, C = Bits of the respective data type
}

type DataType = DataTypes | TypeHandle | PacketHandle;
type DataTypeArray = ((DataType | DataTypeArray)[]|{[name: string]: DataType | DataTypeArray});

namespace DataTypes {
    /**
     * Decodes native datatypes, reads directly from the datastream
     * @param dataType Datatype of the value to decode
     * @param extraType Datatype of the next value to decode, useful for arrays because they require 2 types
     * @param index Index of the next unread byte
     * @param view Dataview to access the datastream
     * @param byteArray Bytearray to access the arraybuffer
     * @param latestBoolI The index of the last bool byte to keep track of where to put the bools
     * @param boolAmount The amount of bools stored in the latest bool byte so it can allocate a new one if needed
     * @returns the decoded value and the index of the next unread byte
     */
    export function decodeNative (dataType: DataTypes, extraType: DataTypes | TypeHandle, index: number, view: DataView, byteArray: Uint8Array, latestBoolI: number, boolAmount: number): { value: any; index: number; skipNextType: boolean, latestBoolI: number, boolAmount: number}
    /**
     * Encodes native datatypes, writes directly to the provided datastream at the index returned by the index callback
     * @param arg The argument to encode
     * @param dataType The datatype to encode the argument to
     * @param extraType The next type for types like Array, who require an datatype for their children
     * @param byteArray The byteArray
     * @param view A dataview of the byteArray
     * @param index Returns the index of the next byte to write and
     * takes in an argument (length) which steps the index the next time this function is invoked.
     * Also makes sure there is always enough space allocated
     * @param latestBoolI The index of the last bool byte to keep track of where to put the bools
     * @param boolAmount The amount of bools stored in the latest bool byte so it can allocate a new one if needed
     * @returns An object detailing wether the extra datatype was 'consumed', the index of the last allocated byte for a boolean and the amount of booleans currently stored in that byte
     */
    export function encodeNative(arg: (boolean | number | string)[], dataType: DataTypes, extraType: DataTypes | TypeHandle, byteArray: Uint8Array, view: DataView, index: (length: number) => number, latestBoolI: number, boolAmount: number): { skipNextType: boolean, booleanIndex: number, newBoolAmount: number }
}