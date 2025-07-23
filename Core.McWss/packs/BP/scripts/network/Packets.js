import NetDataWriter from "./NetDataWriter";

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
    LoginToken;
    Major;
    Minor;
    Build;

    constructor(loginToken, major, minor, build)
    {
        super();
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
        writer.putString(this.LoginToken);
        writer.putInt(this.Major);
        writer.putInt(this.Minor);
        writer.putInt(this.Build);
    }
}

export { McApiPacket, LoginPacket }