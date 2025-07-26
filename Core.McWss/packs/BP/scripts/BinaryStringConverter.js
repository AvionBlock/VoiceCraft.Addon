export default class BinaryStringConverter
{
    /** 
     * @description Converts a Uint8Array to a string.
     * @param { Uint8Array } bytes
     * @param { Number } offset
     * @param { Number } length
     * @returns { String }
     */
    static encode(bytes, offset, length)
    {
        return String.fromCharCode.apply(null, bytes.slice(offset, length));
    }

    /**
     * @description Converts a string to a Uint8Array.
     * @param { String } chars
     * @param { Number } offset
     * @param { Number } length
     * @returns { Uint8Array }
     */
    static decode(chars, offset, length)
    {
        const bytes = new Uint8Array(length);
        for(let i = offset; i < offset + length; i++)
        {
            bytes[i] = chars.charCodeAt(i);
        }
        return bytes;
    }
}