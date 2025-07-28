import { world, system } from "@minecraft/server"
import { packetIdCharset } from "./Transcoder";
import { DataTypes } from "./DataTypes";

let overworld;
system.run(()=>{
    overworld = world.getDimension("minecraft:overworld")
})

/**
 * Encodes a number to bits as a Varint
 * @param {number} value Number to encode
 * @returns {Uint8Array} The binary representation of the varint
 */
export function encodeVarint(value) {
    const bytes = [];
    while (value > 127) {
        bytes.push((value & 0x7f) | 0x80);
        value >>>= 7;
    }
    bytes.push(value & 0x7f);

    return Uint8Array.from(bytes);
}

/**
 * Decodes to the number from a dataview of an Uint8Array
 * @param {DataView<ArrayBuffer>} view Dataview of an Uint8Array
 * @param {number} index Index to start reading the bytes from
 * @returns {{decodedValue: number, index: number}} The varint decoded as a js native number
 * and an index indicating how many bytes the varint took up
 */
export function decodeVarint(view, index=0) {
    let value = 0;
    let shift = 0;

    while (true) {
        let byte = view.getUint8(index);

        // Extract the lower 7 bits and add them
        value |= (byte & 0x7f) << shift;

        index++;

        // If highest bit = 0, then this is the end
        if ((byte & 0x80) === 0) {
            break;
        }

        shift += 7;
    }

    return {decodedValue: value, index: index};
}

/**
 * Sends a scriptevent message provided an id (namespaced) and msg
 * @param {string} id Id of the message. Has to have a namespace prefix and cant be minecraft:
 * @param {string} msg Data string of the message
 */
export function sendMsg(id, msg) {
    overworld.runCommand(`scriptevent "${id.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")}" ${msg}`)
}

/**
 * Generates a random id
 */
export function randomId(length=12) {
    const len = packetIdCharset.length;
    let res = "";
    for (let i = 0; i < length; i++) {
        res += packetIdCharset.charAt(Math.floor(Math.random() * 256))
    }
    return res;
}

/**
 * Packs all the necessary information that makes up a packet into a string describing it
 * that can be universally read and understood even with protocol changes such as new datatypes
 * @param {string} name Name of the Packet
 * @param {DataTypes[]|{[name: string]: DataTypes}} packetInfoTypes Types describing the packet
 * @param {import("./Handle").TypeHandle[]} builtInDataTypes Internal buildin data type object
 * @returns 
 */
export function getDataStructString(name, packetInfoTypes, builtInDataTypes) {
    // This code transfers the type into a string representing its structure, essential in the syncing process
    let typeArray = []

    let boolAmount = 0;
    Object.keys(packetInfoTypes).forEach((key)=>{
        const dataType = packetInfoTypes[key]
        const typeId = typeof dataType === "number" ? builtInDataTypes[dataType].id : dataType.id
        if(typeId == '' || !typeId) return console.warn("[Illegal Type] reported for "+name+" at index "+key); // Illegal type, skip it
        
        if(dataType === DataTypes.Boolean) {
            // Check if the last bool wouldve been filled by now so that a new one would be needed
            if(boolAmount % 8 === 0) {
                typeArray.push(typeId)
                boolAmount -= 8
            }
        } else typeArray.push(typeId) // Add the type
    })
    return name + ' ' + typeArray.join(';')
}