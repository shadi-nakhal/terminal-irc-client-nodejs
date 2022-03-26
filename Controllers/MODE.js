const Settings = require('../settings');
const { EscapeCarets } = require("../Helpers/EscapeCarets")

function MODE(parsed, client){
    if(parsed.params.length > 2 && (parsed.params[0][0] === '#' || parsed.params[0][0] === '&')){
        let messageDictionary = {'v' : 'voice', 'o' : 'channel operator status', '+' : 'sets', '-':'removes', 'b' : 'ban'}
        let nicksDictionary = {'v' : '+','O' : '@', 'o' : '@', 'h' : '%', 'a' : '&', 'q' : '~'}
        let parsedMode = parsed.params[1]
        let givesOrTake = messageDictionary[parsedMode[0]] || 'given'
        let mode = messageDictionary[parsedMode[1]] || 'a lolipop'
        let length = parsed.params.length -1
        let channel = parsed.params[0].toLowerCase()
        let identity = parsed.identity
        let opNick = parsed.prefix.split("!")[0]
        let modedNick = parsed.params[length]
        let chanNicks = Settings[identity][channel]['chanNicks']
        let newlist = chanNicks.map(obj => {
            if(obj.nickname === modedNick){
                if(parsedMode[0] === '+'){
                    if(obj.prefix) return {...obj, prefix : [ ...obj.prefix, nicksDictionary[parsedMode[1]]]}
                    return {...obj, prefix : [nicksDictionary[parsedMode[1]]]}
                }
                if(parsedMode[0] === '-'){
                    if(obj.prefix){
                        let tempPrefixList = obj.prefix.filter(m => m !== nicksDictionary[parsedMode[1]])
                        let newPrefixList = tempPrefixList.length > 0 ? tempPrefixList : false
                        return {...obj, prefix : newPrefixList}
                    }
                }
                
            }
            return obj
        })
        Settings[identity][channel]['chanNicks'] = newlist
        Settings[identity][channel].logs += `^Y**${EscapeCarets(opNick)} ${givesOrTake} ${modedNick}'s ${mode}!^\r\n`
    }
}


module.exports = { MODE }