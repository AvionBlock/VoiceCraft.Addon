export class UTF8 {
    constructor() {
        throw new Error("Cannot initialize a static class!");
    }
    /**
     * @description Encodes a string into a Uint8Array.
     */
    static GetBytes(s) {
        const byteCount = this.GetByteCount(s);
        if (byteCount === 0)
            return undefined;
        const bytes = new Uint8Array(byteCount);
        this.SetBytes(s, 0, s.length, bytes, 0);
        return bytes;
    }
    /**
     * @description Encodes a range of characters from a string into a Uint8Array.
     */
    static SetBytes(s, charIndex, charCount, bytes, byteIndex) {
        if (s.length - charIndex < charCount)
            throw new RangeError("Argument out of range!", { cause: "s" });
        if (byteIndex > bytes.length)
            throw new RangeError("Byte Index must be less than or equal to bytes.length!", { cause: "byteIndex" });
        charCount = Math.min(charCount, s.length);
        let bytesEncoded = 0;
        for (let i = charIndex; i < charIndex + charCount; i++) {
            const charCode = s.charCodeAt(i);
            const byteCount = this.SetBytesFromCharCode(charCode, bytes, byteIndex);
            if (byteCount === undefined)
                continue;
            bytesEncoded += byteCount;
            byteIndex += byteCount;
        }
        return bytesEncoded;
    }
    /**
     * @description Decodes a range of bytes from a Uint8Array into a string.
     */
    static GetString(bytes, index, count) {
        if (bytes.length - index < count)
            throw new RangeError("Count argument out of range!");
        const charCodes = [];
        const maxIndex = count + index;
        while (index < maxIndex) {
            const charCode = this.GetCharCodeFromBytes(bytes, index);
            if (charCode !== undefined) {
                charCodes.push(charCode);
                index += this.GetByteCountFromCharCode(charCode); //We know it's a valid utf8 character.
                continue;
            }
            index++;
        }
        return String.fromCharCode.apply(null, charCodes);
    }
    //#region Byte Count Stuff
    /**
     * @description Calculates the exact number of bytes required to encode the string.
     */
    static GetByteCount(chars) {
        let bytesCount = 0;
        for (let i = 0; i < chars.length; i++) {
            const byteCount = this.GetByteCountFromCharCode(chars.charCodeAt(i));
            if (byteCount === undefined)
                continue;
            bytesCount += byteCount;
        }
        return bytesCount;
    }
    /**
     * @description Calculates the exact number characters encoded into the byte array.
     */
    static GetCharCount(bytes, index, count) {
        const maxIndex = count + index;
        let charCount = 0;
        while (index < maxIndex) {
            if ((bytes[index] & 0xc0) != 0x80)
                charCount++;
            index++;
        }
        return charCount;
    }
    //#endregion
    /**
     * @description Calculates the maximum number of bytes produced by encoding the specified number of characters.
     */
    static GetMaxByteCount(charCount) {
        return (charCount + 1) * 3;
    }
    //#region Charcode Stuff
    /**
     * @description Calculates the required numbers of bytes to encode the specified char code.
     */
    static GetByteCountFromCharCode(charCode) {
        if (charCode <= 0x7f) {
            return 1;
        }
        else if (charCode <= 0x7ff) {
            return 2;
        }
        else if (charCode <= 0xffff) {
            return 3;
        }
        return undefined;
    }
    /**
     * @description Get's a Uint8Array with the encoded bytes for the specified charcode.
     */
    static GetBytesFromCharCode(charCode) {
        const byteCount = this.GetByteCountFromCharCode(charCode);
        if (byteCount === undefined)
            return undefined;
        const bytes = new Uint8Array(byteCount);
        this.SetBytesFromCharCode(charCode, bytes, 0);
        return bytes;
    }
    /**
     * @description Sets a Uint8Array with the encoded bytes for the specified charcode.
     */
    static SetBytesFromCharCode(charCode, bytes, index) {
        let byteCount = this.GetByteCountFromCharCode(charCode);
        switch (byteCount) {
            case 1:
                if (bytes.length < index) {
                    byteCount = undefined;
                    break;
                }
                bytes[index] = charCode;
                break;
            case 2:
                if (bytes.length < index + 1) {
                    byteCount = undefined;
                    break;
                }
                bytes[index++] = 0xc0 | (charCode >> 6);
                bytes[index] = 0x80 | (charCode & 0x3f);
                break;
            case 3:
                if (bytes.length < index + 2) {
                    byteCount = undefined;
                    break;
                }
                bytes[index++] = 0xe0 | (charCode >> 12);
                bytes[index++] = 0x80 | ((charCode >> 6) & 0x3f);
                bytes[index] = 0x80 | (charCode & 0x3f);
                break;
        }
        return byteCount;
    }
    /**
     * @description Get's a charcode from the specified Uint8Array at index.
     */
    static GetCharCodeFromBytes(bytes, index) {
        const byte = bytes[index];
        if ((byte & 0x80) === 0) {
            return byte;
        }
        else if ((byte & 0xe0) == 0xc0) {
            const byte2 = bytes[++index];
            return ((byte & 0x1f) << 6) | (byte2 & 0x3f);
        }
        else if ((byte & 0xf0) == 0xe0) {
            const byte2 = bytes[++index];
            const byte3 = bytes[++index];
            return ((byte & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f);
        }
        else if ((byte & 0xf8) == 0xf0) {
            const byte2 = bytes[++index];
            const byte3 = bytes[++index];
            const byte4 = bytes[++index];
            return (((byte & 0x0f) << 18) |
                ((byte2 & 0x3f) << 12) |
                ((byte3 & 0x3f) << 6) |
                (byte4 & 0x3f));
        }
        return undefined;
    }
}
