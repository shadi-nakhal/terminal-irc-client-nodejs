const IrcParser = require("./Helpers/IrcParser");
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
    ShowChanModes,
    ShowChanDate,
    ShowBanList,
    ShowEndOfBanList,
    AlreadyReg,
    Notice,
    Status
} = require("./Controllers/index");

class Listener{
    constructor() {
        this.temp = "";
        this.message = [];
    }

  Listen = (data, identity, client, server, password, originalNick) => {
    data = data.toString();
    const buffer = (data) => {
        let len = data.length - 1;
        let temp = this.temp;
        if (data.charCodeAt(len) !== 10) {
            this.temp += data;
            return;
         }
        if (data.charCodeAt(len) === 10) {
            if (temp.length > 0) {
                let test = this.temp + data;
                this.message.push(test);
                this.temp = "";
                return;
            }
            if (data.length > 1){
                this.message.push(data);
            }
        }
    };
    buffer(data);
    const rnparse = this.message.flatMap((e) => e.split("\r\n"));
    for (const raw of rnparse) {
        if (raw.length > 0) {
            const parsed = IrcParser(raw, identity);
            const { command, params } = parsed;
            Status(parsed);
            if(command === "001") WELCOME(params, identity, client, password, originalNick); // RPL_WELCOME (001)
            if(command === "004") SERVERINFO(identity, server); // RPL_MYINFO (004) server info
            if(command === "462") AlreadyReg(parsed, client);
            if(command === "376" || command === "422") MOTD(client, parsed); // RPL_MOTD (372)
            if(command === "433") NICKNAMEINUSE(client, parsed, identity); // ERR_NICKNAMEINUSE (433)
            if(command === "ERROR") HandleKill(client, raw);
            if(command === "NOTICE") Notice(parsed);
            if(command === "PING" || command === "PONG") PING(parsed, params, client);
            if(command === "353") GETNAMES(parsed); // RPL_NAMREPLY (353
            if(command === "366") SHOWNAMES(parsed); // RPL_ENDOFNAMES (366)'
            if(command === "NICK") CHANGEDNICK(parsed, identity);
            if(command === "JOIN") JOIN(client, parsed);
            if(command === "PART" || command === "QUIT" || command === "KICK") LEAVING(parsed, identity);
            if(command === "311") WHOISUSER(params);
            if(command === "312") WHOISSERVER(params, client);
            if(command === "319") WHOISCHANNELS(params, client);
            if(command === "317") WHOISIDLE(params, client);
            if(command === "318") ENDOFWHOIS(parsed, client);
            if(command === "332") SetTopic(parsed);
            if(command === "PRIVMSG") PRIVMSG(parsed, client);
            if(command === "MODE") MODE(parsed);
            if(command === "324") ShowChanModes(parsed);
            if(command === "329") ShowChanDate(parsed);
            if(command === "367") ShowBanList(parsed);
            if(command === "368") ShowEndOfBanList(parsed);
            this.message.pop();
        }
    }
};
}

module.exports = { Listener };
