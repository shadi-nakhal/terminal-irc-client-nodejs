

const Settings = require('../settings')


function PRIVMSG(parsed, client){

    if(parsed.params[0][0] === '#'){
        let senderNickname = parsed.prefix.split("!")[0]
        let msg = parsed.params.slice(1).join(" ")
        let channelsname = parsed.params[0].toLowerCase()
        Settings[parsed.identity][channelsname].logs += `^m${senderNickname}^::${msg}\r\n`
    }
    if(parsed.params[1] == '\x01VERSION\x01'){
        let senderNickname = parsed.prefix.split("!")[0]
        client.write(`PRIVMSG ${senderNickname} : this Frankenstein's client 1.0\r\n`)
        client.write(`PRIVMSG ${senderNickname} :\u0001VERSION\u0001\r\n`)
    } 
    if(parsed.params[0] === Settings[parsed.identity].nickname){
        let otherNick = parsed.raw.split(":")[1].split("!")[0]
        if(!Settings[parsed.identity]['private']) Settings[parsed.identity]['private'] = {}
        if(!Settings[parsed.identity]['private'][otherNick]) Settings[parsed.identity]['private'][otherNick] = {}
        if(!Settings[parsed.identity]['private'][otherNick].logs) Settings[parsed.identity]['private'][otherNick].logs = ""
        Settings[parsed.identity]['private'][otherNick].logs += `^m${otherNick}^:: ${parsed.params.slice(1).join(" ")}\r\n`
    }

}


module.exports = { PRIVMSG }