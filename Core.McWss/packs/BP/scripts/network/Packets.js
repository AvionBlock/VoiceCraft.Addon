class McApiPacket
{
    constructor()
    {

    }

    /**
     * @param { NetDataWriter } writer 
     */
    serialize(writer)
    {

    }

    /**
     * @param { NetDataReader } reader 
     */
    deserialize(reader)
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
     * @param { NetDataWriter } writer 
     */
    serialize(writer)
    {

    }
}

export { McApiPacket, LoginPacket }