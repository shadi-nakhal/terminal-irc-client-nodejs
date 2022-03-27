const { term } = require("./Dom");

const parser = require("./parser");
const {
    WHOISUSER,
    WHOISSERVER,
    WHOISCHANNELS,
    WHOISIDLE,
    ENDOFWHOIS,
    PING,
    NICKNAMEINUSE,
    CHANGEDNICK,
    LEAVING,
    JOIN,
    GETNAMES,
    HandleKill,
    SHOWNAMES,
    MOTD,
    WELCOME,
    SERVERINFO,
    PRIVMSG,
    SetTopic,
    MODE,
    AlreadyReg,
} = require("./Controllers/index");
const Settings = require("./settings");
const { Connecting } = require("./Connection");

class Listener extends Connecting {
    constructor({ server, port, user, realname, nickname, channels }) {
        super(server, port, user, realname, nickname, channels);
        this.identity;
    }
    Start() {
        this.Connect();
        let client = this.client;
        let identity = this.identity;
        let server = this.server;
        Settings[identity].status = "";
        client.on("data", (data) => {

            data = data.toString().trim();
            let rnparse = data.split("\r\n");
            for (let raw of rnparse) {
                let date = new Date().toTimeString().slice(0,8) + " "
                // make a unquie session ident pass it to the parser
                let parsed = parser(raw, identity); // and then pass it with the parsed data!!
                let { command, params } = parsed;
                Settings[identity].status += date+raw + "\r\n";
                if (command === "PING" || command === "PONG") PING(parsed, params, client);
                if (command === "001") WELCOME(params, identity, client); // RPL_WELCOME (001)
                if(command === "462") AlreadyReg(parsed, client)
                if (command === "004") SERVERINFO(identity, server); // RPL_MYINFO (004) server info
                if (command === "376" || command === "422") MOTD(client, parsed); // RPL_MOTD (372)
                if (command === "353") GETNAMES(parsed); // RPL_NAMREPLY (353
                if (command === "366") SHOWNAMES(parsed); // RPL_ENDOFNAMES (366)'
                if (command === "NICK") CHANGEDNICK(parsed, identity);
                if (command === "JOIN") JOIN(client, parsed);
                if (command === "PART" || command === "QUIT" || command === "KICK") LEAVING(parsed, identity);
                if (command === "311") WHOISUSER(params);
                if (command === "312") WHOISSERVER(params, client);
                if (command === "319") WHOISCHANNELS(params, client);
                if (command === "317") WHOISIDLE(params, client);
                if (command === "318") ENDOFWHOIS(params, client);
                if (command === "332") SetTopic(parsed);
                if (command === "PRIVMSG") PRIVMSG(parsed, client);
                if (command === "433") NICKNAMEINUSE(client, parsed, identity); // ERR_NICKNAMEINUSE (433)
                if (command === "MODE") MODE(parsed, client);
                if (command === "ERROR") HandleKill(client, raw);
            }
        });
    }
}

module.exports = { Listener };
