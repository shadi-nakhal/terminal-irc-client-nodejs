const Settings = require('../settings')


function MOTD(client, parsed){ // RPL_ENDOFMOTD (376)
    let joinedChans = Settings[parsed.identity].joinedChans
    let channels = joinedChans.length > 0 ? joinedChans : Settings[parsed.identity].channels
    if(channels.length > 0)
        client.write(`JOIN ${channels.toString()}\r\n`)
   Settings[parsed.identity].PassedMOTD = true
}


module.exports = { MOTD }