function HandleKill(client, raw){
    let temp = raw.split(":").slice(1)
    let msg = `(${temp[0]}:${temp[1]})`
    client.emit('SERVERERROR', msg)
}



module.exports = { HandleKill }