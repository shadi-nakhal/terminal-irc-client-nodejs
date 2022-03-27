const Settings = require('../settings')
const { EscapeCarets } = require("../Helpers/EscapeCarets")


function PRIVMSG(parsed, client){
    let senderNickname = parsed.raw.split(":")[1].split("!")[0]

    if(parsed.params[0][0] === '#'){
        let ownNick = Settings[parsed.identity].nickname
        let channelsname = parsed.params[0].toLowerCase()
        let msgArray = parsed.params.slice(1).map(element => {
            if(element.toLowerCase() === ownNick.toLowerCase()){
                Settings[parsed.identity][channelsname]["mentioned"] = true;
                return element = `^C${element}^`
            }return EscapeCarets(element)
        });
        let msg = msgArray.join(" ")

        Settings[parsed.identity][channelsname].logs += `^m${EscapeCarets(senderNickname)}^::${msg}\r\n`
    }
    if(parsed.params[1] == '\x01VERSION\x01'){
        let senderNickname = parsed.prefix.split("!")[0]
        client.write(`PRIVMSG ${senderNickname} : this Frankenstein's client 1.0\r\n`)
        client.write(`PRIVMSG ${senderNickname} :\u0001VERSION\u0001\r\n`)
    } 
    if(parsed.params[0] === Settings[parsed.identity].nickname){
        let senderNickname = parsed.raw.split(":")[1].split("!")[0]
        let msg = parsed.params.slice(1).join(" ")
        if(!Settings[parsed.identity]['private']) Settings[parsed.identity]['private'] = {}
        if(!Settings[parsed.identity]['private'][senderNickname]) Settings[parsed.identity]['private'][senderNickname] = {}
        if(!Settings[parsed.identity]['private'][senderNickname].logs) Settings[parsed.identity]['private'][senderNickname].logs = ""
        Settings[parsed.identity]['private'][senderNickname].logs += `^m${EscapeCarets(senderNickname)}^::${EscapeCarets(msg)}\r\n`

    }

}


module.exports = { PRIVMSG }