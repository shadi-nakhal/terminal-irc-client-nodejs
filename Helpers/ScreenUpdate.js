const { EscapeCarets } = require("./EscapeCarets");
const { connectionsPool } = require("./ConnectionsPool");
const { Update } = require("./Update");
const { Room } = require("../Components");
const { term } = require("../Dom");
const Settings = require("../settings");
const IrcParser = require("./IrcParser");

function ScreenUpdate() {
    let chanbutt = Settings.chanbutt;
    connectionsPool().map((connection) => {
        function UpdateScreen(data) {
            data = data.toString().trim();
            let rnparse = data.split("\r\n");
            for (let raw of rnparse) {
                let parsed = IrcParser(raw, connection.identity);
                let ownNick = Settings[parsed.identity].nickname;
                if (parsed.command === "PRIVMSG") {
                    if (parsed.params[0] === ownNick && parsed.params[1].charCodeAt(0) !== 1) {
                        let otherNick = parsed.raw.split(":")[1].split("!")[0];
                        let viewed = chanbutt.owner === parsed.identity && chanbutt.name === otherNick;
                        let content = viewed ? `^m>${EscapeCarets(otherNick)}^` : `^m${EscapeCarets(otherNick)}^`;
                        if (!Settings[parsed.identity]["private"][otherNick]["exists"]) {
                            Room.GenerateChannels({ name: otherNick, type: "private", owner: parsed.identity });
                            Settings[parsed.identity]["private"][otherNick]["exists"] = true;
                        }
                        Settings[parsed.identity]["private"][otherNick]["viewed"] = viewed;
                        Room.channelz.itemsDef.find((e) => e.id === parsed.identity + "_" + otherNick).content =
                            content;
                        Room.channelz.onParentResize();
                    }
                    if (parsed.params[0][0] === "#") {
                        let channel = parsed.params[0].toLowerCase();
                        let viewed = chanbutt.owner === parsed.identity && chanbutt.name === channel;
                        let content = viewed ? `^m>${parsed.params[0]}^` : `^m${parsed.params[0]}^`;
                        if (Settings[parsed.identity][channel]["mentioned"])
                            content = viewed ? `^C>${parsed.params[0]}^` : `^C${parsed.params[0]}^`;
                        Settings[parsed.identity][channel]["viewed"] = viewed;
                        Room.channelz.itemsDef.find((e) => e.id === parsed.identity + "_" + channel).content = content;
                        Room.channelz.onParentResize();
                    }
                }
                Update();
                Room.changePrompt(Settings[chanbutt?.owner]?.nickname || "");
            }
        }
        if (connection.UpdateScreen !== true) {
            connection.client.on("data", UpdateScreen);

            connection.client.on("timeout", () => {
                Update();
            });
            connection.client.on("error", () => {
                Update();
            });

            connection.UpdateScreen = true;
        }
    });
    term.hideCursor(true);
}

module.exports = { ScreenUpdate };
