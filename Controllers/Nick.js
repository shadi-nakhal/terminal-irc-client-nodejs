const Settings = require("../settings");

function NICKNAMEINUSE(client, parsed, ident) {
    //ERR_NICKNAMEINUSE (433)
    let count = Settings[ident]?.count;
    let newPrefix = parsed.prefix.split("!")[1];
    if (!Settings[ident].PassedMOTD) {
        if (Settings.nicknames[count]) {
            //checking nicknames list using the user's count var
            let nick = Settings.nicknames[count];
            client.write(`NICK ${nick}\r\n`);
            Settings[ident].nickname = nick;
            Settings[ident].prefix = nick + "!" + newPrefix;
            Settings[ident].count++;
        } else {
            let nick = Settings.nicknames[0] + Settings[ident].count;
            Settings[ident].prefix = nick + "!" + newPrefix;
            client.write(`NICK ${nick}\r\n`);
            Settings[ident].nickname = nick;
        }
    }
}

function CHANGEDNICK(parsed, identity) {// on NICK command
    let nickname = parsed.prefix.split("!")[0];
    if (Settings[identity].nickname === nickname) {
        nickname = Settings[identity].nickname;
        Settings[identity].prefix = parsed.params[0] + "!" + parsed.params[1];
        Settings[identity].nickname = parsed.params[0];
    }
    Settings[identity].joinedChans.forEach((element) => {
        if (Settings[identity][element]["chanNicks"].some((nick) => nick.nickname === nickname)) {
            Settings[identity][element]["chanNicks"] = Settings[identity][element]["chanNicks"].map((obj) => {
                if (obj.nickname === nickname) return { ...obj, nickname: parsed.params[0] };
                return obj;
            });
            Settings[identity][element].logs += `^Y**${nickname} is now known as ${parsed.params[0]}^\r\n`;
        console.logger(element)
        }
    });

    // client.write(`NAMES ${incomingChannel} \r\n`)

}

module.exports = { NICKNAMEINUSE, CHANGEDNICK };
