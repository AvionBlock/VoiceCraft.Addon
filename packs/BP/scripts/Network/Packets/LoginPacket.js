import { McApiPacket } from "./McApiPacket"

class LoginPacket extends McApiPacket
{
    constructor(loginToken, major, minor, build)
    {
        this.LoginToken = loginToken;
        this.Major = major;
        this.Minor = minor;
        this.Build = build;
    }
}