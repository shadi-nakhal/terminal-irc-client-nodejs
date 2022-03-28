const Settings = require("../settings");
const { EscapeCarets } = require("../Helpers/EscapeCarets");

let counter = 0;
let resetTimeON = false;

function PRIVMSG(parsed, client) {
    let senderNickname = parsed.raw.split(":")[1].split("!")[0];
    let channelsname = parsed.params[0].toLowerCase();
    let ownNick = Settings[parsed.identity].nickname;


    function MsgThroatle(nickname, msg){
        if (counter < 3) {
            client.write(`NOTICE ${nickname} :${msg}\r\n`);
            counter++;
        }
        if (!resetTimeON) {
            setTimeout(() => {
                counter = 0;
                resetTimeON = false;
            }, 60000);
            resetTimeON = true;
        }
    }

    function MsgParser(msg) {
        let msgArray = msg.map((element) => {
            if (element.toLowerCase() === ownNick.toLowerCase()) {
                Settings[parsed.identity][channelsname]["mentioned"] = true;
                return (element = `^C${element}^`);
            }
            return EscapeCarets(element);
        });
        let parsedMsg = msgArray.join(" ");
        if (msgArray[0] === "\x01ACTION") {
            parsedMsg = parsedMsg.replace("\x01ACTION", "");
            return `^m* ${EscapeCarets(senderNickname)}${parsedMsg}^\r\n`;
        }
        return `^m${EscapeCarets(senderNickname)}^::${parsedMsg}\r\n`;
    }

    if (parsed.params[0][0] === "#") {
        Settings[parsed.identity][channelsname].logs += MsgParser(parsed.params.slice(1));
    }

    if (parsed.params[1] === "\x01VERSION\x01") {
        MsgThroatle(senderNickname, `\u0001VERSION Frankenstein's client 1.0\u0001`)
    }

    if (parsed.params[1] === "\x01PING") {
        MsgThroatle(senderNickname, parsed.params.slice(1).join(" "))
    }

    if (parsed.params[0] === ownNick && parsed.params[1].charCodeAt(0) !== 1) {
        if (!Settings[parsed.identity]["private"]) Settings[parsed.identity]["private"] = {};
        if (!Settings[parsed.identity]["private"][senderNickname])
            Settings[parsed.identity]["private"][senderNickname] = {};
        if (!Settings[parsed.identity]["private"][senderNickname].logs)
            Settings[parsed.identity]["private"][senderNickname].logs = "";
        Settings[parsed.identity]["private"][senderNickname].logs += MsgParser(parsed.params.slice(1));
    }
}

module.exports = { PRIVMSG };
