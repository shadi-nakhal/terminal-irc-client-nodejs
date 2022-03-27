const Settings = require("../settings");

function AlreadyReg(parsed, client){
    let incomingnickName = parsed.params[0]
        Settings[parsed.identity].nickname = incomingnickName
        client.write(`PING ${Settings[parsed.identity].nickname}\r\n`);
    // let joinedChans = Settings[parsed.identity].joinedChans
    // let channels = joinedChans.length > 0 ? joinedChans : Settings[parsed.identity].channels
    // if(channels?.length > 0)
    //     client.write(`NAMES ${channels.toString()}\r\n`)
    
}


module.exports = { AlreadyReg }