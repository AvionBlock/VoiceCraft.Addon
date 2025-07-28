import { DataTypes } from "./DataTypes";
import { Transcoder, packetIdCharset } from "./Transcoder"
import { config } from "./config";
import { randomId, sendMsg } from "./utils";
import { system } from "@minecraft/server"

const encoder = Transcoder

/** @type {{[packetId: string]: ((output: DecodedStruct)=>void)[]}} */ 
export const listeners = {}

export class TypeHandle {
    /**
     * A TypeHandle is an object that acts as an interface when you register your type to be send via communication protocol
     * @param {string} name 
     * @param {string} id 
     * @param {import("./DataTypes").DataTypeArray} datatypes 
     */
    constructor(name, id, datatypes) {
        Object.values(datatypes).forEach((dataType,i)=>{ // Validation
            if(isNaN(dataType) && !(dataType instanceof TypeHandle)) throw "Invalid Datatype recieved. Datatypes must either be a native from the datatypes enum or registered through the Type-/Packethandle API   Argument ["+i+"]"
        })

        this.name = name;
        this.id = id;
        /** @type {(PacketHandle | TypeHandle)[]} */
        this.datatypes = datatypes;
    }

    /**
     * Decodes an input bytearray using the Handle's Decoder interface and magically returns the type complex structure defined via the Types structure.
     * Try it!
     * @param {Uint8Array} byteArray The data payload
     * @param {number} [index=0] Rules which byte is to read next
     */
    decode(byteArray, index = 0) {
        const buffer = byteArray.buffer
        let view = new DataView(buffer)

        let output = Array.isArray(this.datatypes) ? [] : {}
        let latestBoolIndex = 0; // the index of the last allocated byte for a boolean
        let boolAmount = 0; // the amount of booleans stored in that byte

        let skipDataType = false;

        // Loop over the array or the object (this method works with both)
        const keys = Object.keys(this.datatypes)
        keys.forEach((key,kI)=>{
            if(skipDataType) return skipDataType = false;

            const dataType = this.datatypes[key]
            if(isNaN(dataType)) {
                if(!(dataType instanceof TypeHandle)) throw "Error: type is neither a native datatype nor registered!"

                let {decodedParameters, index: i} = dataType.decode(byteArray, index);
                output[key] = decodedParameters;

                index = i;
            } else {
                // Some data requires 2 types, e.g. when its an array it requires the type of element of the array.
                const nextType = this.datatypes[keys[kI+1]];

                let { value, index: i, skipNextType, latestBoolI, boolAmount: bA } = DataTypes.decodeNative(dataType, nextType, index, view, byteArray, latestBoolIndex, boolAmount)
                output[key] = value;
                
                index = i;
                latestBoolIndex = latestBoolI;
                boolAmount = bA;
                skipDataType = skipNextType;
            }
        })
        return { decodedParameters: output, index: index}
    }

    /**
     * Encodes the provided data based on the type's datatype array
     * @param {(boolean | number | string)[]} data 
     * @param {number} [bI=0] Buffer Index, can be used to skip certain elements in the provided data
     * @returns {{ byteArray: Uint8Array, index: number }}
     */
    encode(data, bI = 0) {
        let arr = new Uint8Array(config.defaultEncodingBufferSize)
        let view = new DataView(arr.buffer)
        let length = arr.byteLength;

        /**
         * Returns the index of the next byte to write and takes in an argument (length)
         *  which steps the index the next time this function is invoked.
         * Also makes sure there is always enough space allocated
         * @param {number} sizeRequired 
         * @returns 
         */
        function index(sizeRequired) { // Allocates more bytes if it runs out of them and increases the index
            // Increase the index
            let oldI = bI;
            bI += sizeRequired;

            // Exit if array doesnt need to be enlarged
            if((sizeRequired + bI) <= length) return oldI;
            // Increase array size
            const biggerArray = new Uint8Array(arr.buffer, 0, length * 2);

            arr = biggerArray;
            view = new DataView(arr.buffer);
            length = arr.byteLength;

            return oldI;
        }
        
        // Bools Logic
        let latestBoolI = 0; // the index of the last allocated byte for a boolean
        let boolAmount = 0; // the amount of booleans stored in that byte

        const keys = Object.keys(this.datatypes);
        const keysLen = keys.length;
        const types = this.datatypes;
        
        // Loop through each element in the right encoding order and encode it
        for (let kI = 0; kI < keysLen; kI++) {
            const key = keys[kI];

            // Get the arg and its type
            const dataType = types[key]
            let arg = data[key]

            // Native datatypes are internally referenced as a number form, so you can check if its a native type by using isNaN
            if(isNaN(dataType)) {
                if(!(dataType instanceof TypeHandle)) throw "Error: type is neither a native datatype nor registered!"

                let {byteArray, index: i} = dataType.encode(arg, bI)
                arr.set(byteArray, bI)
                bI = i;
            } else try {
                // Some data requires 2 types, e.g. when its an array it requires the type of element of the array. 
                const nextType = types[keys[kI+1]];

                // native datatypes directly write to the datastream so there is no need to get the byte array and concatenate them
                let { booleanIndex, newBoolAmount, skipNextType } = DataTypes.encodeNative(
                    arg, dataType, nextType, // argument info
                    arr, view, // byte array
                    index, // index and allocation
                    latestBoolI, boolAmount // bool info
                )

                latestBoolI = booleanIndex;
                boolAmount = newBoolAmount;

                if(skipNextType) kI++;
            } catch(err) {
                console.error(err.stack)
                console.error(err)
                // throw `${err} ${JSON.stringify(arg,null,4)}`
            }
        }
        return { byteArray: arr.subarray(0, bI), index: bI };
    }
}

/** Stores all the outgoing packet requests until its confirmed they have been send */
export const sendPackets = {};
export class PacketHandle extends TypeHandle {
    /**
     * The Packet Handle holds methods to send this packet type
     * add event listeners and acts as an easy way to identify and
     * reference this Packettype across code.
     * 
     * @param {string} name 
     * @param {string} id 
     * @param {import("./DataTypes").DataTypeArray} datatypes 
     */
    constructor(name, id, datatypes) {
        super(name, id, datatypes)
    }

    /**
     * Sends the packet
     * @param {(string|boolean|number)[]} data 
     */
    send(data) {
        // Encode the data arguments to binary
        const {byteArray, index} = this.encode(data)
        const payload = encoder.encode(byteArray, index) // Convert the binary byte array to strings

        // Generate a request id to ensure the packet was send and for split packet payloads
        const requestId = randomId(12);
        const length = payload.length;

        if(length > config.maxMessageSize) {
            // Send payload in portions
            let portionCountDec = length / config.maxMessageSize;
            let portionCount = Math.floor(portionCountDec)
            if(portionCount != portionCountDec) portionCount++; // This is for the rest result which isnt an entire portion

            for (let i = 0; i < portionCount; i++) {
                /* The orderNumber is the reverse number of the order they were decoded in.
                 * This way the algorhytm knows which element is the last (0) without any additional information
                 * and the length of the array in which the requests are cached in */
                const orderNumber = portionCount - i;
                const orderId = encoder.encodeId(orderNumber).padStart(4, packetIdCharset[0]);
                
                this.sendRequest(`packet:${this.id}-${requestId}-${orderId}`, `"${payload.substring(i*config.maxMessageSize, (i+1)*config.maxMessageSize)}"`, requestId + orderId)
            }
        } else this.sendRequest(`packet:${this.id}-${requestId}`, `"${payload}"`, requestId)
    }

    /**
     * Adds an event listener for this Packet
     * @typedef {string | number | boolean | []} DecodedStruct
     * @param {(output: DecodedStruct)=>void} callback 
     */
    listen(callback) {
        if(!listeners[this.id]) listeners[this.id] = [ callback ]
        else listeners[this.id].push(callback)
    }

    /**
     * Sends off the packet and ensures it got send.
     * @param {string} head The encoded data string of the head
     * @param {string} body The encoded data string of the body
     * @param {string} id Id of the request. In this implementation this id is the requestId + orderId
     */
    async sendRequest(head, body, id) {
        // Try to send the request as much times as configured before giving up
        let success = false
        for (let tries = 0; tries < config.maxSendTries; tries++) {
            // Send the request
            sendMsg(head, body)

            success = await new Promise((res)=>{
                sendPackets[id] = res // Wait for the system to confirm that the request has been send
                system.waitTicks(40).then(res) // Wait for Minecraft to "timeout" the request attempt. waitTicks() returns void which makes the success check false
            })
            // Check if the packet has been send
            if(success) break;
        }
        if(!success) throw "Fatal Error: Unable to send packet request <[ "+head+" ]>.\nBody: "+body
    }
}