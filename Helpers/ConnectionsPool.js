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
    Pool.filter(pro => pro.identity === identity)[0].client.removeAllListeners()
    Pool.filter(pro => pro.identity === identity)[0].client.destroy()
    Pool = Pool.filter(pro => pro.identity !== identity)
}



function FindCon(identity){
    let con = Pool.filter(pro => pro.identity === identity)[0]
    return con
}

function connectionsPool(){
    return Pool
}


module.exports = {SpinnConnection, FindCon, RemoveCon, connectionsPool}
