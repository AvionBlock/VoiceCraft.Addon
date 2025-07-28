// Charset consisting of all safe 1 byte chars and rest safe 2 byte chars for fast and reliable encoding
export const charset = ' !"#$%&\'()*+,-./0123456789;<=>?ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃ'
export const packetIdCharset = '!"#$%&\'()*+,./0123456789;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃń';

let charMap = new Map()
for (let i = 0; i < charset.length; i++) {
    charMap.set(charset[i], i);
}
let packetIdCharMap = new Map()
for (let i = 0; i < packetIdCharset.length; i++) {
    packetIdCharMap.set(packetIdCharset[i], i);
}
export class Transcoder {
    /**
     * Encodes an Uint8Array to text with transmittion safe charset
     * @param {Uint8Array} bytes 
     * @param {number} end 
     */
    static encode(bytes, end) {
        let res = "";

        const endD = end ?? bytes.byteLength;
        for (let i = 0; i < endD; i++) {
            res += charset.charAt(bytes[i])
        }
        return res;
    }    

    /**
     * An optimized subversion of/alternative to the byte encoder that focuses on
     * exclusively encoding numbers instead of encoding any type encoded from a
     * byte array, avoiding the need to create a byte array just to encode one
     * (unsigned) integer. Therefor it can profit of optimizations you can only
     * pull on the encoding of integers.
     * 
     * Used in the packet head and therefor uses the packetId charset.
     * @param {number} num Number to encode 
     */
    static encodeId(num) {
        let res = "";
        while(true) {
            res = packetIdCharset.charAt(num & 0b11111111) + res;
            num = num >> 8;
            if(num===0) break;
        }
        return res;
    }

    /**
     * Uses (potentially unsafe) unicode character encoding so it cannot be used for safe data transmission
     * @param {Uint8Array} bytes 
     * @returns 
     */
    static unicodeEncode(bytes) {
        let text = '';
        let i = 0;
    
        while (i < bytes.length) {
            let byte1 = bytes[i++];
    
            if (byte1 <= 0x7F) {
                // 1-byte character (ASCII)
                text += String.fromCharCode(byte1);
            } else if (byte1 <= 0xDF) {
                // 2-byte character
                let byte2 = bytes[i++];
                text += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F));
            } else if (byte1 <= 0xEF) {
                // 3-byte character
                let byte2 = bytes[i++];
                let byte3 = bytes[i++];
                text += String.fromCharCode(((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
            } else if (byte1 <= 0xF7) {
                // 4-byte character (less common)
                let byte2 = bytes[i++];
                let byte3 = bytes[i++];
                let byte4 = bytes[i++];
                let codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
                // Surrogate pair conversion
                codePoint -= 0x10000;
                text += String.fromCharCode((codePoint >> 10) + 0xD800, (codePoint & 0x3FF) + 0xDC00);
            }
        }
    
        return text;
    }


    /**
     * Decodes text to a Uint8Array using the safe data transmittion charset
     * @param {string} text Text to encode
     */
    static decode(text, start=0, end) {
        const endLen = end ?? text.length;

        const res = new Uint8Array(endLen);
        for (let i = start; i < endLen; i++) {
            res[i-start] = charMap.get(text[i])
        }
        return res;
    }

    /**
     * An optimized subversion of/alternative to the text to byte decoder that
     * focuses on exclusively decoding numbers instead of decoding any type
     * decoded from a byte array, avoiding the need to create a byte array just
     * to decode one (unsigned) integer. Therefor it can profit of optimizations
     * you can only pull on the decoding of integers.
     * 
     * Used in the packet head and therefor uses the packetId charset.
     * @param {string} str Chars to decode
     */
    static decodeId(str) {
        let num = 0;
        for (const char of str) {
            num = num << 8;
            num += packetIdCharMap.get(char)
        }
        return num;
    }
    
    /**
     * Uses (potentially unsafe) unicode character decoding so it cannot be used for safe data transmission
     * @param {string} text
     * @returns 
     */
    static unicodeDecode(text) {
        let bytes = [];
        for (let i = 0; i < text.length; i++) {
            let codePoint = text.charCodeAt(i);
    
            if (codePoint <= 0x7F) {
                // 1-byte character (ASCII)
                bytes.push(codePoint);
            } else if (codePoint <= 0x7FF) {
                // 2-byte character
                bytes.push(0xC0 | (codePoint >> 6));
                bytes.push(0x80 | (codePoint & 0x3F));
            } else if (codePoint <= 0xFFFF) {
                // 3-byte character
                bytes.push(0xE0 | (codePoint >> 12));
                bytes.push(0x80 | ((codePoint >> 6) & 0x3F));
                bytes.push(0x80 | (codePoint & 0x3F));
            } else {
                // 4-byte character (surrogate pairs)
                codePoint -= 0x10000;
                let highSurrogate = (codePoint >> 10) + 0xD800;
                let lowSurrogate = (codePoint & 0x3FF) + 0xDC00;
                bytes.push(0xF0 | (highSurrogate >> 18));
                bytes.push(0x80 | ((highSurrogate >> 12) & 0x3F));
                bytes.push(0x80 | ((highSurrogate >> 6) & 0x3F));
                bytes.push(0x80 | (highSurrogate & 0x3F));
                bytes.push(0xF0 | (lowSurrogate >> 18));
                bytes.push(0x80 | ((lowSurrogate >> 12) & 0x3F));
                bytes.push(0x80 | ((lowSurrogate >> 6) & 0x3F));
                bytes.push(0x80 | (lowSurrogate & 0x3F));
            }
        }
        return new Uint8Array(bytes);
    }
}