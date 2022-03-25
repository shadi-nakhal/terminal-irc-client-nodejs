const Settings = require('../settings')


function MOTD(client, parsed){ // RPL_ENDOFMOTD (376)
    let channels = Settings[parsed.identity].channels || []
    if(channels.length > 0)
        client.write(`JOIN ${channels.toString()}\r\n`)
   Settings[parsed.identity].PassedMOTD = true
}


module.exports = { MOTD }