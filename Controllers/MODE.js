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
        if (parsed.params[0] !== ownNick)
            Settings[identity][channel].logs += `^Y**${EscapeCarets(opNick)} sets mode ${parsedMode} on ${channel}^\r\n`;
        if (parsed.params[0] === ownNick) {
            const { name } = Settings.chanbutt;
            Settings[identity][name].logs += `^Y**${EscapeCarets(opNick)} sets mode ${parsedMode} on ${opNick}^\r\n`;
        }
    }
}

module.exports = { MODE };
