const Settings = require("../settings");
const { EscapeCarets } = require("../Helpers/EscapeCarets");

function MODE(parsed) {
    const messageDictionary = {
        v: "voice",
        h: "half-operator status",
        o: "channel operator status",
        "+": "sets",
        "-": "removes",
        b: "ban"
    };
    const nicksDictionary = {
        v: "+",
        O: "@",
        o: "@",
        h: "%",
        a: "&",
        q: "~"
    };
    const parsedMode = parsed.params[1];
    const givesOrTake = messageDictionary[parsedMode[0]];
    const mode = messageDictionary[parsedMode[1]] || "lolipop status";
    const length = parsed.params.length - 1;
    const channel = parsed.params[0].toLowerCase();
    const { identity } = parsed;
    const opNick = parsed.prefix.split("!")[0];
    const modedNick = parsed.params[length];
    const ownNick = Settings[identity].nickname;
    if (parsed.params.length > 2) {
        const { chanNicks } = Settings[identity][channel];
        const newlist = chanNicks.map((obj) => {
            if (obj.nickname === modedNick) {
                if (parsedMode[0] === "+") {
                    if (obj.prefix) return { ...obj, prefix: [...obj.prefix, nicksDictionary[parsedMode[1]]] };
                    return { ...obj, prefix: [nicksDictionary[parsedMode[1]]] };
                }
                if (parsedMode[0] === "-") {
                    if (obj.prefix) {
                        const tempPrefixList = obj.prefix.filter((m) => m !== nicksDictionary[parsedMode[1]]);
                        const newPrefixList = tempPrefixList.length > 0 ? tempPrefixList : false;
                        return { ...obj, prefix: newPrefixList };
                    }
                }
            }
            return obj;
        });
        Settings[identity][channel].chanNicks = newlist;
        Settings[identity][channel].logs += `^Y**${EscapeCarets(opNick)} ${givesOrTake} ${EscapeCarets(
            modedNick
        )}'s ${mode}^\r\n`;
    }
    if (parsed.params.length === 2) {
        if (parsed.params[0].toLowerCase() !== ownNick.toLowerCase())
            Settings[identity][channel].logs += `^Y**${EscapeCarets(opNick)} sets mode ${parsedMode} on ${channel}^\r\n`;
        if (parsed.params[0].toLowerCase() === ownNick.toLowerCase()) {
            const { name } = Settings.chanbutt;
            if(Settings.chanbutt.type === 'channel')
                Settings[identity][name].logs += `^Y**${EscapeCarets(opNick)} sets mode ${parsedMode} on ${EscapeCarets(opNick)}^\r\n`;
            if(Settings.chanbutt.type === 'server')
                Settings[identity].status += `^Y**${EscapeCarets(opNick)} sets mode ${parsedMode} on ${EscapeCarets(opNick)}^\r\n`;

        }
    }
}

function ShowChanModes(parsed){
    const {params, identity} = parsed;
    const [ channel , modes ] = params.slice(1);
    Settings[identity][channel.toLowerCase()].logs += `^Y**Channel ${channel} modes: ${modes}^\r\n`;
}

function ShowChanDate(parsed){
    const {params, identity} = parsed;
    const [ channel , milliSec ] = params.slice(1);
    const setdate = new Date(milliSec * 1000);
    const date = `${setdate.toDateString()}, ${setdate.toTimeString().split(" ").slice(0,2).join(" ")}`;
    Settings[identity][channel.toLowerCase()].logs += `^Y**Channel ${channel} created on ${date}^\r\n`;
}


function ShowBanList(parsed){
    const {params, identity} = parsed;
    const [ channel , banned, operator, milliSec ] = params.slice(1);
    const setdate = new Date(milliSec * 1000);
    const date = `${setdate.toDateString()}, ${setdate.toTimeString().split(" ").slice(0,2).join(" ")}`;
    Settings[identity][channel.toLowerCase()].logs += `^Y**${channel}: ${EscapeCarets(banned)} by ${EscapeCarets(operator)} on ${date}^\r\n`;
}
function ShowEndOfBanList(parsed){
    const {params, identity} = parsed;
    const [channel] = params.slice(1);
    Settings[identity][channel.toLowerCase()].logs += `^Y**${channel}: End of channel ban list.^\r\n`;

}

module.exports = { MODE, ShowChanModes,ShowChanDate, ShowBanList, ShowEndOfBanList };
