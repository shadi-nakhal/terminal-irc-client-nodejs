const Settings = require('../settings')
const { EscapeCarets } = require("../Helpers/EscapeCarets")


function LEAVING(parsed, identity){
    let command = parsed.command
    let leavingNick = parsed.prefix.split("!")[0]
    let leavingMsg = parsed.params.join(" ")
    let channel = parsed.params[0].toLowerCase()
    let leavingPrefix = parsed.prefix
    let ownNick = Settings[identity].nickname
    if(command === 'PART'){
        if(leavingNick === ownNick){
            Settings[identity].joinedChans = Settings[identity].joinedChans.filter(e => e !== channel)
        }
        let newlist = Settings[identity][channel]['chanNicks'].filter(obj => {
            return obj.nickname !== leavingNick
        })
        Settings[identity][channel]['chanNicks'] = newlist
        if(leavingNick !== ownNick) Settings[identity][channel].logs += "^Y**"+EscapeCarets(leavingNick)+` (${EscapeCarets(leavingPrefix)})`+" has left^\r\n"
    }
    if(command === 'QUIT'){
        let channelsList = Settings[identity].joinedChans // finding the joined channels
        channelsList.map(chan => {
            if(Settings[identity][chan]['chanNicks'].some(nick => nick.nickname === leavingNick)){
            Settings[identity][chan.toLowerCase()].logs += "^Y**"+EscapeCarets(leavingNick)+` (${EscapeCarets(leavingPrefix)})`+" has Quit"+` (${EscapeCarets(leavingMsg)})^\r\n`
            let newlist = Settings[identity][chan.toLowerCase()]['chanNicks'].filter(obj => {
                return obj.nickname !== leavingNick
            })
            Settings[identity][chan]['chanNicks'] = newlist
            }
        })
        if(Settings[identity]['private'][leavingNick]){
            Settings[identity]['private'][leavingNick].logs += "^Y**"+EscapeCarets(leavingNick)+` (${EscapeCarets(leavingPrefix)})`+" has Quit"+` (${EscapeCarets(leavingMsg)})^\r\n`
        }
        
    }
    if(command === 'KICK'){
        let nickname = parsed.params[1];
        let channel = parsed.params[0].toLowerCase();
        let message = parsed.params[2] 
        if(nickname === Settings[identity].nickname){
            Settings[identity][channel]['chanNicks'] = []
            Settings[identity][channel].logs += `^R**"${EscapeCarets(leavingNick)} has kicked you ${EscapeCarets(message)}^\r\n`
            return
        }
        let newlist = Settings[identity][channel]['chanNicks'].filter(obj => {
           return obj.nickname !== nickname
        })
    
        Settings[identity][channel]['chanNicks'] = newlist
        Settings[identity][channel].logs += `^Y**"${EscapeCarets(leavingNick)} has kicked ${EscapeCarets(nickname)} ${message}^\r\n`
    }
}


module.exports = { LEAVING }

