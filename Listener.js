// const IrcParser = require("./Helpers/IrcParser");
// const {
//     WHOISUSER,
//     WHOISSERVER,
//     WHOISCHANNELS,
//     WHOISIDLE,
//     ENDOFWHOIS,
//     PING,
//     NICKNAMEINUSE,
//     CHANGEDNICK,
//     LEAVING,
//     JOIN,
//     GETNAMES,
//     HandleKill,
//     SHOWNAMES,
//     MOTD,
//     WELCOME,
//     SERVERINFO,
//     PRIVMSG,
//     SetTopic,
//     MODE,
//     ShowChanModes,
//     ShowChanDate,
//     ShowBanList,
//     ShowEndOfBanList,
//     AlreadyReg,
//     Notice,
//     Status
// } = require("./Controllers/index");
const { Connecting } = require("./Connection");

class Listener extends Connecting {
    constructor({ server, port, user, realname, nickname, channels, tls }) {
        super(server, port, user, realname, nickname, channels, tls);
    }



    Start() {
        this.MakeIdentity();
        this.CreateSettings();
        this.Connect();
        // const { identity, client, server} = this;
        // client.on("data", (data) => this.Listen(data, identity, client, server));
    }
}

module.exports = { Listener };
