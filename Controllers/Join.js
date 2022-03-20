const Settings = require('../settings')
const { Room } = require('../Components/index')


function JOIN(client,parsed){
    let incomingChannel = parsed.params[0].toLowerCase()
    let identity = parsed.identity
    let incomingPrefix = parsed.prefix
    let joinedChans = Settings[identity].joinedChans
    let userServer = Settings[identity].server.toLowerCase()
    let nickname = parsed.prefix.split("!")[0]
    let usernickname = Settings[identity].nickname


    if(nickname !== usernickname){// if its not user who joined it updates the nicknames list
     client.write(`NAMES ${incomingChannel} \r\n`)
     if(Settings[identity][incomingChannel])
     Settings[identity][incomingChannel].logs += "^Y**" + nickname + ` (${incomingPrefix})` + " has joined^\r\n" 
    }
    if(nickname === usernickname){
        if(!joinedChans.includes(incomingChannel)){
            Settings[identity].joinedChans = [...Settings[identity].joinedChans, incomingChannel]
            if(!Settings[identity][incomingChannel]) Settings[identity][incomingChannel] = {name : incomingChannel, logs : '', chanNicks : [], main : '', topic : ''}
            Settings[identity][incomingChannel].chanNicks = []
            Room.GenerateChannels({
                type : 'channel', 
                name : incomingChannel,
                server: userServer,
                owner: identity
            })
        }
    } 
}

function SetTopic(parsed){
    let identity = parsed.identity
    let topic = parsed.params.slice(2).join(" ")+"\r\n"
    let channel = parsed.params[1].toLowerCase()
    Settings[identity][channel].topic = topic
    Settings[identity][channel].logs += topic
}

module.exports = { JOIN, SetTopic}
