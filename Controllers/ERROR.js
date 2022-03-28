const { EscapeCarets } = require("../Helpers/EscapeCarets")

function HandleKill(client, raw){
    let temp = raw.split(":").slice(1)
    let msg = EscapeCarets(`(${temp[0]}:${temp[1]})`)
    client.emit('error', msg)
}



module.exports = { HandleKill }