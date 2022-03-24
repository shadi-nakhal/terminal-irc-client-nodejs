

const Settings = require('../settings')

let timeout = {}


function PING(parsed, params, client){ // repling pings
    if(parsed.command === 'PING') client.write(`PONG ${params}\r\n`)
    if(parsed.command === 'PONG'){
        clearTimeout(Settings[parsed.identity]['timeout'])
        Settings[parsed.identity]['ping'] = setTimeout(() => {
            client.write(`PING ${Settings[parsed.identity].nickname}\r\n`)
        }, 70000);
    }
     Settings[parsed.identity]['timeout'] = setTimeout(() => { 
        client.emit('timeout', "Ping timeout")
    }, 90000);
}


module.exports = { PING }