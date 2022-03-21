const Settings = require('../settings')

const { Listener } = require('../Listener')

let Pool = []

function SpinnConnection(instances){
    let channelsToGenerate = []
    for(let i of instances){
        let newcon = new Listener(i)
        newcon.Start()
        Pool.push(newcon)
        channelsToGenerate.push({type : 'server', name : newcon.server, owner: newcon.identity})
    }
    return channelsToGenerate
}


function RemoveCon(identity){
    let target = Pool.find(pro => pro.identity === identity)
    clearTimeout(Settings[identity]['timeout'])
    clearTimeout(Settings[identity]['ping'])
    clearTimeout(Settings[identity]['connect'])
    target.connecting = false
    Settings[identity].PassedMOTD = false
    target.client.removeAllListeners()
    if(target.connecting === false) target.client.destroy()
    Pool = Pool.filter(pro => pro.identity !== identity)
}



function FindCon(identity){
    let con = Pool.find(pro => pro.identity === identity)
    return con
}

function connectionsPool(){
    return Pool
}


module.exports = {SpinnConnection, FindCon, RemoveCon, connectionsPool}
