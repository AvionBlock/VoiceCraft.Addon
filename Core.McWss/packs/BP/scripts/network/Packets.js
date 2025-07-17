class McApiPacket
{
    constructor()
    {

    }

    /**
     * @param { DataView } buffer 
     * @param { Number } index 
     */
    serialize(buffer, index)
    {

    }

    /**
     * @param { DataView } buffer 
     * @param { Number } index 
     */
    deserialize(buffer, index)
    {
        
    }
}

class LoginPacket extends McApiPacket
{
    constructor(loginToken, major, minor, build)
    {
        this.LoginToken = loginToken;
        this.Major = major;
        this.Minor = minor;
        this.Build = build;
    }

    /**
     * @param { NetDataWriter } buffer 
     * @param { Number } index 
     */
    serialize(buffer, index)
    {

    }
}

export { McApiPacket, LoginPacket }