const Settings = require("./settings");
const { text } = require("./helpfile");
const { term, document } = require("./Dom");
const { DisplayInfo } = require("./Helpers/DisplayInfo");
const { ServerCommand, ConnectCommand } = require("./Helpers/FsCommands");
const parser = require("./parser");
const { Room } = require("./Components");
const { SpinnConnection, FindCon, RemoveCon, connectionsPool } = require("./Helpers/ConnectionsPool");
const { NickSorter } = require("./Helpers/NicksSorter");

let chanbutt;

Room.channelz.on("submit", ChannelButton);

function ChannelButton(channalButton) {
    if (channalButton?.name !== chanbutt?.name || channalButton?.owner !== chanbutt?.owner) {
        document.giveFocusTo(Room.input);
        Settings.chanbutt = channalButton;
        chanbutt = channalButton;
        if (channalButton.type === "Frankenstein") {
            Room.Status.setContent(text, true, true);
            Room.ShowStatus();
            Room.Status.scrollToBottom();
        }
        if (channalButton.type === "server") {
            Room.Status.setContent(Settings[channalButton.owner].status, true, true);
            Room.ShowStatus();
            Room.Status.scrollToBottom();
        }
        if (channalButton.type === "channel") {
            Room.Nicks.setContent(NickSorter(Settings[chanbutt.owner][chanbutt.name]["chanNicks"]));
            Room.Main.setContent(Settings[channalButton.owner][channalButton.name].logs, true, true);
            Settings[channalButton.owner][channalButton.name]["viewed"] = true;
            Settings[channalButton.owner][channalButton.name]["mentioned"] = false
            Room.ShowRoom();
            Room.Main.scrollToBottom();
        }
        if (channalButton.type === "private") {
            Room.Status.setContent(Settings[channalButton.owner]["private"][channalButton.name].logs, true, true);
            Settings[channalButton.owner]["private"][channalButton.name]["viewed"] = true;
            Room.ShowStatus();
            Room.Status.scrollToBottom();
        }
        Room.input.setContent("");
        Room.changePrompt(Settings[channalButton.owner]?.nickname || "");
    }
    term.hideCursor(true);
}

async function InputParser(data) {
    let incoming = data;
    let notFrankenstein = chanbutt?.type !== "Frankenstein";
    let connection;
    if (chanbutt) connection = FindCon(chanbutt.owner);
    let channel, message, nick, channelId;
    if (data[0] === "/") {
        incoming = data.split(" ");
        Room.input.setContent("");
        switch (incoming[0].toLowerCase()) {
            case "/server":
                try {
                    let serverCommand = await ServerCommand(incoming);
                    return { data: DisplayInfo(serverCommand), command: true };
                } catch (err) {
                    return { data: err, command: true };
                }
            case "/connect":
                try {
                    let { server, port, user, realname, nickname, channels } = await ConnectCommand(incoming);
                    let spinnedServer = SpinnConnection([{ server, port, user, realname, nickname, channels }]);
                    spinnedServer.map((chan) => Room.GenerateChannels(chan));
                    update();
                    return;
                } catch (err) {
                    return { data: err, command: true };
                }
            case "/part":
                if (chanbutt?.type === "channel") {
                    connection.client.write(`PART ${chanbutt.name}\r\n`);
                    channelId = chanbutt.owner + "_" + chanbutt.name;
                    Room.channelz.children
                        .find((btn) => btn.value.type === "server" && btn.value.owner === chanbutt.owner)
                        .submit();
                    Room.DestroyChannel(channelId);
                }
                return;
            case "/close":
                if (chanbutt?.type === "private") {
                    Settings[chanbutt.owner]["private"][chanbutt.name]["exists"] = false;
                    channelId = chanbutt.owner + "_" + chanbutt.name;
                    Room.channelz.children
                        .find((btn) => btn.value.type === "server" && btn.value.owner === chanbutt.owner)
                        .submit();
                    Room.DestroyChannel(channelId);
                }
                return;
            case "/query":
                nick = incoming[1];
                if (nick && notFrankenstein) {
                    if (!Settings[chanbutt.owner]["private"]) Settings[chanbutt.owner]["private"] = {};
                    if (!Settings[chanbutt.owner]["private"][nick]) Settings[chanbutt.owner]["private"][nick] = {};
                    if (!Settings[chanbutt.owner]["private"][nick].exists) {
                        Room.GenerateChannels({ name: nick, type: "private", owner: chanbutt.owner });
                        if (!Settings[chanbutt.owner]["private"][nick].logs)
                            Settings[chanbutt.owner]["private"][nick].logs = "";
                        Settings[chanbutt.owner]["private"][nick].exists = true;
                    }
                    Room.channelz.children
                        .find((btn) => btn.value.type === "private" && btn.value.name === nick)
                        .submit();
                }
                return;
            case "/join":
                channel = incoming[1]?.toLowerCase();
                if (notFrankenstein) connection.client.write(`JOIN ${channel}\r\n`);
                return;
            case "/quit":
                if (!notFrankenstein) {
                    term.reset();
                    process.exit();
                }
                message = incoming.slice(1).join(" ");
                connection.client.write(`QUIT :${message}\r\n`);
                Room.channelz.children
                    .filter((chan) => chan.value.owner === connection.identity)
                    .map((e) => Room.DestroyChannel(e.key));
                RemoveCon(connection.identity);
                Room.channelz.children.length > 0;
                Room.channelz.children[Room.channelz.children.length - 1].submit();
                Room.changePrompt("");
                return;
            case "/kick":
                message = incoming[2] || "Eeee-yah!";
                if (incoming[1] && notFrankenstein)
                    connection.client.write(`KICK ${chanbutt.name} ${incoming[1]} ${message}\r\n`);
                return;
            case "/nick":
                if (incoming[1] && notFrankenstein) connection.client.write(`NICK ${incoming[1]}\r\n`);
                return;
            case "/op":
                if (incoming[1] && notFrankenstein)
                    connection.client.write(`mode ${chanbutt.name} +o ${incoming[1]}\r\n`);
                return;
            case "/deop":
                if (incoming[1] && notFrankenstein)
                    connection.client.write(`mode ${chanbutt.name} -o ${incoming[1]}\r\n`);
                return;
            case "/ban":
                channel = incoming[1][0] === "#" || incoming[1][0] === "&" ? incoming[1] : chanbutt.name;
                nick = incoming[1][0] === "#" || incoming[1][0] === "&" ? incoming[2] : incoming[1];
                if (nick && channel && notFrankenstein) connection.client.write(`mode ${channel} +b ${nick}\r\n`);
                return;
            case "/unban":
                channel = incoming[1][0] === "#" || incoming[1][0] === "&" ? incoming[1] : chanbutt.name;
                nick = incoming[1][0] === "#" || incoming[1][0] === "&" ? incoming[2] : incoming[1];
                if (nick && channel && notFrankenstein) connection.client.write(`mode ${channel} -b ${nick}\r\n`);
                return;
            case "/voice":
                if (incoming[1] && notFrankenstein)
                    connection.client.write(`mode ${chanbutt.name} +v ${incoming[1]}\r\n`);
                return;
            case "/devoice":
                if (incoming[1] && notFrankenstein)
                    connection.client.write(`mode ${chanbutt.name} -v ${incoming[1]}\r\n`);
                return;
            case "/query":
                null;
                return;
            case "/test":
                Getlisteners();
                return;
        }

        return { data: `${incoming[0]} is not a command`, command: true };
    }

    return { data: incoming, command: false };
}

function update() {
    connectionsPool().map((connection) => {
        function UpdateScreen(data) {
            data = data.toString().trim();
            let rnparse = data.split("\r\n");
            for (let raw of rnparse) {
                let parsed = parser(raw, connection.identity);
                if (parsed.command === "PRIVMSG") {
                    if (parsed.params[0] === Settings[parsed.identity].nickname) {
                        let otherNick = parsed.raw.split(":")[1].split("!")[0];
                        if (!Settings[parsed.identity]["private"][otherNick]["exists"]) {
                            Room.GenerateChannels({ name: otherNick, type: "private", owner: parsed.identity });
                            Settings[parsed.identity]["private"][otherNick]["exists"] = true;
                        }
                        Settings[parsed.identity]["private"][otherNick]["viewed"] = false;
                        Room.channelz.itemsDef.find(
                            (e) => e.id === parsed.identity + "_" + otherNick
                        ).content = `^m${otherNick}^`;
                        Room.channelz.onParentResize();
                    }
                    if (parsed.params[0][0] === "#") {
                        let channel = parsed.params[0].toLowerCase();
                        let content = `^m${parsed.params[0]}^`
                        if(Settings[parsed.identity][channel]["mentioned"]) content = `^C${parsed.params[0]}^`
                        Settings[parsed.identity][channel]["viewed"] = false;
                        Room.channelz.itemsDef.find(
                            (e) => e.id === parsed.identity + "_" + channel
                        ).content = content ;
                        Room.channelz.onParentResize();

                    }
                }
                if (chanbutt?.type === "server") {
                    Room.Status.setContent(Settings[chanbutt.owner].status, true, true);
                    Room.Status.scrollToBottom();
                }
                if (chanbutt?.type === "channel") {
                    Room.Main.setContent(Settings[chanbutt.owner][chanbutt.name]?.logs, true, true);
                    Room.Nicks.setContent(NickSorter(Settings[chanbutt.owner][chanbutt.name]["chanNicks"]));
                    Room.Main.scrollToBottom();
                }
                if (chanbutt.type === "private") {
                    Room.Status.setContent(Settings[chanbutt.owner]["private"][chanbutt.name].logs, true, true);
                    Settings[chanbutt.owner]["private"][chanbutt.name]["viewed"] = true;
                    Room.Status.scrollToBottom();
                }
                Room.changePrompt(Settings[chanbutt?.owner]?.nickname || "");
            }
        }
        if (connection.UpdateScreen !== true) {
            connection.client.on("data", UpdateScreen);

            connection.client.on("timeout", () => {
                if (chanbutt?.type === "server") {
                    Room.Status.setContent(Settings[chanbutt.owner].status, true, true);
                    Room.Status.scrollToBottom();
                }
                if (chanbutt?.type === "channel") {
                    Room.Main.setContent(Settings[chanbutt.owner][chanbutt.name]?.logs, true, true);
                    Room.Nicks.setContent(NickSorter(Settings[chanbutt.owner][chanbutt.name]["chanNicks"]));
                    Room.Main.scrollToBottom();
                }
            });
            connection.client.on("error", () => {
                if (chanbutt?.type === "server") {
                    Room.Status.setContent(Settings[chanbutt.owner].status, true, true);
                    Room.Status.scrollToBottom();
                }
                if (chanbutt?.type === "channel") {
                    Room.Main.setContent(Settings[chanbutt.owner][chanbutt.name]?.logs, true, true);
                    Room.Nicks.setContent(NickSorter(Settings[chanbutt.owner][chanbutt.name]["chanNicks"]));
                    Room.Main.scrollToBottom();
                }
            });

            connection.UpdateScreen = true;
        }
    });
    term.hideCursor(true);
}

async function onInputSubmit(value) {
    let inputmsg = await InputParser(value);
    try {
        let data, escapedData
        if (inputmsg && inputmsg.data){
            data = await inputmsg.data
            escapedData = data
            if(data.includes('^')) escapedData = data.replace('^', '^^')
        }
        if (chanbutt && inputmsg) {
            let connection = FindCon(chanbutt.owner);
            if (connection?.identity === chanbutt.owner && value) {
                if (chanbutt.type === "channel") {
                    let nickname = Settings[chanbutt.owner].nickname;
                    if(nickname.includes('^')) nickname = nickname.replace('^', '^^')
                    if (!inputmsg.command)
                        Settings[chanbutt.owner][chanbutt.name].logs += `^C${nickname}^::${escapedData}\r\n`;
                    if (inputmsg.command) Settings[chanbutt.owner][chanbutt.name].logs += `^R${data}^\r\n`;
                    Room.Main.setContent(Settings[chanbutt.owner][chanbutt.name].logs, true, true);
                    Room.Main.scrollToBottom();
                    if (!inputmsg.command) connection.client.write(`PRIVMSG ${chanbutt.name} :${data}\r\n`);
                    Room.input.setContent("");
                }
                if (chanbutt.type === "server") {
                    if (inputmsg.command) Settings[chanbutt.owner].status += `^R${data}\r\n^`;
                    Room.Status.setContent(Settings[chanbutt.owner].status, true, true);
                    Room.Status.scrollToBottom();
                    if (!inputmsg.command) connection.client.write(data + "\r\n");
                    Room.input.setContent("");
                }
                if (chanbutt.type === "private") {
                    let nickname = Settings[chanbutt.owner].nickname;
                    if(nickname.includes('^')) nickname = nickname.replace('^', '^^')
                    if (!inputmsg.command)
                        Settings[chanbutt.owner]["private"][chanbutt.name].logs += `^C${nickname}^::${escapedData}\r\n`;
                    if (inputmsg.command) Settings[chanbutt.owner]["private"][chanbutt.name].logs += `^R${data}^\r\n`;
                    Room.Status.setContent(Settings[chanbutt.owner]["private"][chanbutt.name].logs, true, true);
                    Room.Status.scrollToBottom();
                    if (!inputmsg.command) connection.client.write(`PRIVMSG ${chanbutt.name} :${data}\r\n`);
                    Room.input.setContent("");
                }
            }
            if (chanbutt.type === "Frankenstein" && inputmsg.command) {
                Room.Status.appendLog(`^R${data}^\r\n`);
            }
        }
    } catch (err) {
        console.logger(err, "onInputSubmit");
    }
    term.hideCursor(true);
}

Room.input.on("submit", onInputSubmit);

Room.channelz.children[0].submit();

function Getlisteners() {
    connectionsPool().map((con) => {
        console.logger(con.client.listeners("data"), "listening on data");
        console.logger(con.client.listenerCount("data"), "data listeners");
        console.logger(con.client.listenerCount("timeout"), "timeout listeners");
        console.logger(con.client.eventNames(), "event names");
        console.logger(connectionsPool().length, "connections");
        console.logger("-----------------------");
    });
}
