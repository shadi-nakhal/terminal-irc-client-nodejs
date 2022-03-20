

const Settings = require('../settings')


function PRIVMSG(parsed, client){

    if(parsed.params[0][0] == '#'){
        let senderNickname = parsed.prefix.split("!")[0]
        let msg = parsed.params.slice(1).join(" ")
        let channelsname = parsed.params[0].toLowerCase()
        Settings[parsed.identity][channelsname].logs += "^m"+senderNickname+"^::"+msg+"\r\n"
    }
    if(parsed.params[1] == '\x01VERSION\x01'){
        let senderNickname = parsed.prefix.split("!")[0]
        client.write(`PRIVMSG ${senderNickname} : this Frankenstein's client 1.0\n\r`)
        client.write(`PRIVMSG ${senderNickname} :\u0001VERSION\u0001\n\r`)
    }    
}


module.exports = { PRIVMSG }