

const Settings = require('../settings')

function PING(parsed, params, client){ // repling pings
    if(parsed.command === 'PING') client.write(`PONG ${params}\r\n`)
    if(parsed.command === 'PONG'){
        clearTimeout(Settings[parsed.identity]['timeout'])
        clearTimeout(Settings[parsed.identity]['ping'])
        clearTimeout(Settings[parsed.identity]['connect'])
        Settings[parsed.identity].disconnected = false
        Settings[parsed.identity]['ping'] = setTimeout(() => {
            client.write(`PING ${Settings[parsed.identity].nickname}\r\n`)
        }, 60000);
    }
    //  Settings[parsed.identity]['timeout'] = setTimeout(() => {
    //     Settings[parsed.identity].disconnected = true
    //     client.emit('timeout', "Ping timeout")
    // }, 10000);
}


module.exports = { PING }