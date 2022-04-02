const Settings = require('./settings');
const { text } = require('./helpfile');
const { term, document } = require('./Dom');
const { InputParser } = require('./Helpers/InputParser');
const { Room } = require('./Components');
const { FindCon } = require('./Helpers/ConnectionsPool');
const { Update } = require('./Helpers/Update');
const { EscapeCarets } = require('./Helpers/EscapeCarets');

let chanbutt;

Room.channelz.on('submit', ChannelButton);

function ChannelButton(channalButton) {
  if (channalButton?.name !== chanbutt?.name || channalButton?.owner !== chanbutt?.owner) {
    document.giveFocusTo(Room.input);
    Settings.chanbutt = channalButton;
    chanbutt = channalButton;
    if (channalButton.type === 'Frankenstein') {
      Room.Status.setContent(text, true, true);
      Room.ShowStatus();
      Room.Status.scrollToBottom();
    }
    if (channalButton.type === 'server') {
      Room.ShowStatus();
      Update();
    }
    if (channalButton.type === 'channel') {
      Update();
      Settings[channalButton.owner][channalButton.name].viewed = true;
      Settings[channalButton.owner][channalButton.name].mentioned = false;
      Room.ShowRoom();
    }
    if (channalButton.type === 'private') {
      Settings[channalButton.owner].private[channalButton.name].viewed = true;
      Room.ShowStatus();
      Update();
    }
    Room.input.setContent('');
    Room.changePrompt(Settings[channalButton.owner]?.nickname || '');
  }
  term.hideCursor(true);
}

async function onInputSubmit(value) {
  const inputmsg = await InputParser(value);
  try {
    let data;
    if (inputmsg && inputmsg.data) {
      data = await inputmsg.data;
    }
    if (chanbutt && inputmsg) {
      const connection = FindCon(chanbutt.owner);
      if (connection?.identity === chanbutt.owner && value) {
        const { nickname } = Settings[chanbutt.owner];
        if (chanbutt.type === 'channel') {
          if (!inputmsg.command) {
            Settings[chanbutt.owner][chanbutt.name].logs += `^C${EscapeCarets(nickname)}^::${EscapeCarets(
              data
            )}\r\n`;
          }
          if (inputmsg.command) Settings[chanbutt.owner][chanbutt.name].logs += `^R${data}^\r\n`;
          Update();
          if (!inputmsg.command) connection.client.write(`PRIVMSG ${chanbutt.name} :${data}\r\n`);
        }
        if (chanbutt.type === 'server') {
          if (inputmsg.command) Settings[chanbutt.owner].status += `^R${data}\r\n^`;
          Update();
          if (!inputmsg.command) connection.client.write(`${data}\r\n`);
        }
        if (chanbutt.type === 'private') {
          if (!inputmsg.command) {
            Settings[chanbutt.owner].private[chanbutt.name].logs += `^C${EscapeCarets(
              nickname
            )}^::${EscapeCarets(data)}\r\n`;
          }
          if (inputmsg.command) Settings[chanbutt.owner].private[chanbutt.name].logs += `^R${data}^\r\n`;
          Update();
          if (!inputmsg.command) connection.client.write(`PRIVMSG ${chanbutt.name} :${data}\r\n`);
        }
      }
      Room.input.setContent('');
      if (chanbutt.type === 'Frankenstein' && inputmsg.command) {
        Room.Status.appendLog(`^R${data}^\r\n`);
      }
    }
  } catch (err) {
    console.logger(err, 'onInputSubmit');
  }
  term.hideCursor(true);
}

Room.input.on('submit', onInputSubmit);

Room.channelz.children[0].submit();
