const Settings = require('../settings')


function MOTD(client, parsed){ // RPL_ENDOFMOTD (376)
    let channels = Settings[parsed.identity].channels || []
    if(channels.length > 0) channels.forEach(channel => {
        client.write(`JOIN ${channel}\r\n`)       
    });
   Settings[parsed.identity].PassedMOTD = true
}


module.exports = { MOTD }