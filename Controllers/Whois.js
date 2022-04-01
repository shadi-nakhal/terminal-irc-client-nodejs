const Settings = require("../settings");


let whois = []
let channel


function IdleTime(secs, signed){ // finding idle time
    var idle = new Date(0);
    idle.setSeconds(secs);
    var idleString = idle.toISOString().split(".")[0].split("T")[1];
    var signedOn = new Date(0);
    signedOn.setSeconds(signed);
    var sign = signedOn.toISOString().split(".")[0].split("T").reverse();
    return { idle : idleString, signedon: sign}
}


function WHOISUSER(params) { // RPL_WHOISUSER (311)
    whois = []
    let p = params
    let msg1 = `[${p[1]}] (${p[2]}@${p[3]}) ${p[5]}`
    whois.push(msg1)
}

function WHOISSERVER(params, client) { // RPL_WHOISSERVER (312)
    let p = params
    let msg2 = `[${p[1]}] ${p.slice(2).join(" ")}`
    whois.push(msg2)
}

function WHOISCHANNELS(params, client) { // RPL_WHOISCHANNELS (319)
    let p = params
    let msg3 = `[${p[1]}] ${p.slice(2).join(" ")}`
    channel = params[2].toLowerCase()
    whois.push(msg3)
}


function WHOISIDLE(params, client) { // RPL_WHOISIDLE (317)
    let p = params
    let time = IdleTime(p[2], p[3])
    let msg4 = `[${p[1]}] idle ${time.idle}, signon ${time.signedon[0]}, ${time.signedon[1]}`
    whois.push(msg4)
}

function ENDOFWHOIS(parsed, client) { // RPL_ENDOFWHOIS (318)
    let p = parsed.params
    let chanbutt = Settings.chanbutt
    let chan = Settings.chanbutt.name.toLowerCase()
    let msg4 = `[${p[1]}] ${p.slice(2).join(" ")}`
    whois.push(msg4)
    if(chanbutt.type === 'server')
        whois.forEach((ms) => Settings[parsed.identity].status += `^y* ${ms}^\r\n` )
    if(chanbutt.type === 'channel')
        whois.forEach((ms) => Settings[parsed.identity][chan].logs += `^y* ${ms}^\r\n` )
    channel = ""
    whois = []
}



module.exports = {WHOISUSER, WHOISSERVER, WHOISCHANNELS, WHOISIDLE, ENDOFWHOIS}