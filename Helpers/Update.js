const { Room } = require("../Components");
const Settings = require("../settings");
const { NickSorter } = require("./NicksSorter");

function Update(channelButton) {
    let chanbutt = Settings.chanbutt;
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
        Room.Status.scrollToBottom();
    }
}


module.exports = { Update }