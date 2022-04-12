const Settings = require('../settings');
const { EscapeCarets } = require('../Helpers/EscapeCarets');

function Notice(parsed){
    const {params , identity } = parsed;
    const senderNick = parsed.prefix.includes("!") ? parsed.prefix.split("!")[0] : parsed.prefix;
    const message = params.slice(1);
    const joinedChans = Settings[identity].joinedChans;
    if(!parsed.prefix.includes("!")) {
       return Settings[identity].status += `^y--${EscapeCarets(senderNick)}--:${EscapeCarets(message.join(" "))}^\r\n`;
    }
    const FindIfCommonChan = joinedChans.filter((chan) => Settings[identity][chan]['chanNicks'].some((nick) => nick.nickname === senderNick));
    if(FindIfCommonChan.length > 0){
        Settings[identity][FindIfCommonChan[0].toLowerCase()].mentioned = true;
        Settings[identity][FindIfCommonChan[0].toLowerCase()].logs += `^y--${EscapeCarets(senderNick)}--:${EscapeCarets(message.join(" "))}^\r\n`;
        return;
    }
    if(joinedChans.length > 0){
        Settings[identity][joinedChans[0].toLowerCase()].mentioned = true;
        Settings[identity][joinedChans[0].toLowerCase()].logs += `^y--${EscapeCarets(senderNick)}--:${EscapeCarets(message.join(" "))}^\r\n`;
        return;
    }else {
        Settings[identity].status += `^y--${EscapeCarets(senderNick)}--:${EscapeCarets(message.join(" "))}^\r\n`;
    }
}

module.exports = { Notice };