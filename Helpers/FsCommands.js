const { FlagsParser } = require('./FlagsParser')
const { HandleFs } = require('./HandleFs')
const { fsActions } = require('./FsActions')

function ConnectCommand(incoming) {
    if (Array.isArray(incoming) && incoming.length > 1) {
        if (incoming.length === 2) {
            let data = HandleFs({
                [incoming[1]]: {
                    server: [incoming[1]],
                    action : fsActions.show
                }
            })
            return data
        } else {
            return FlagsParser(incoming)
        }
    }
    return `/connect "" is not a command`
}


function ServerCommand(incoming) {
    const {
        server,
        port,
        nickname,
        user,
        realname,
        password,
        serverpassword,
        channels
    } = FlagsParser(incoming)
    let config = {}
    switch (incoming[1]) {
        case fsActions.add:
            if (incoming[2] && server && port) {
                config[incoming[2]] = {
                    server,
                    port,
                    nickname,
                    user,
                    realname,
                    password,
                    serverpassword,
                    channels,
                    action : fsActions.add
                }
                let data = HandleFs(config)
                return data

            }
            break
        case fsActions.del:
            if (incoming[2]) {
                config[incoming[2]] = {
                    server: incoming[2],
                    action: fsActions.del
                }
                let data = HandleFs(config)
                return data
            }
            break
        case fsActions.show:
            if (incoming[2]) {
                config[incoming[2]] = {
                    server: incoming[2],
                    action: fsActions.show
                }
            } else
                config['showAll'] = {
                    action: fsActions.show
                }
                let data = HandleFs(config)
                return data
        default:
            return `/server ${incoming[1]} is not a command`
    }
}


module.exports = { ServerCommand, ConnectCommand }