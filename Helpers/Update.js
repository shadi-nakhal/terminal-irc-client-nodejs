const { Room } = require('../Components');
const Settings = require('../settings');
const { NickSorter } = require('./NicksSorter');

function Update() {
  const { chanbutt } = Settings;
  if (chanbutt?.type === 'server') {
    if(Settings[chanbutt.owner].displayRaw){
      Room.Status.setContent(Settings[chanbutt.owner].raw, true, true);
    }else {
    Room.Status.setContent(Settings[chanbutt.owner].status, true, true);
    }
    Room.Status.scrollToBottom();
  }
  if (chanbutt?.type === 'channel') {
    Room.Main.setContent(Settings[chanbutt.owner][chanbutt.name]?.logs, true, true);
    Room.Nicks.setContent(NickSorter(Settings[chanbutt.owner][chanbutt.name].chanNicks));
    Room.Main.scrollToBottom();
  }
  if (chanbutt.type === 'private') {
    Room.Status.setContent(Settings[chanbutt.owner].private[chanbutt.name].logs, true, true);
    Room.Status.scrollToBottom();
  }
}

function Clear(){
  const { chanbutt } = Settings;
  if (chanbutt?.type === 'server') {
    if(Settings[chanbutt.owner].displayRaw){
      Settings[chanbutt.owner].raw = "";
    }else {
    Settings[chanbutt.owner].status = "";
    }
    Room.Status.scrollToBottom();
  }
  if (chanbutt?.type === 'channel') {
    Settings[chanbutt.owner][chanbutt.name].logs = "";
    Room.Main.scrollToBottom();
  }
  if (chanbutt.type === 'private') {
    Settings[chanbutt.owner].private[chanbutt.name].logs = "";
    Room.Status.scrollToBottom();
  }
}

module.exports = { Update, Clear };
