const { EscapeCarets } = require('./EscapeCarets');
const { connectionsPool } = require('./ConnectionsPool');
const { Update } = require('./Update');
const { Room } = require('../Components');
const { term } = require('../Dom');
const Settings = require('../settings');
const IrcParser = require('./IrcParser');

function ScreenUpdate() {
  connectionsPool().forEach((connection) => {
    function UpdateScreen(data) {
      const { chanbutt } = Settings;
      data = data.toString().trim();
      const rnparse = data.split('\r\n');
      for (const raw of rnparse) {
        const parsed = IrcParser(raw, connection.identity);
        const ownNick = Settings[parsed.identity].nickname;
        if (parsed.command === 'PRIVMSG') {
          if (parsed.params[0] === ownNick && parsed.params[1].charCodeAt(0) !== 1) {
            const otherNick = parsed.raw.split(':')[1].split('!')[0];
            const viewed = chanbutt.owner === parsed.identity && chanbutt.name === otherNick;
            const content = viewed ? `^m>${EscapeCarets(otherNick)}^` : `^m${EscapeCarets(otherNick)}^`;
            if (!Settings[parsed.identity].private[otherNick].exists) {
              Room.GenerateChannels({ name: otherNick, type: 'private', owner: parsed.identity });
              Settings[parsed.identity].private[otherNick].exists = true;
            }
            Settings[parsed.identity].private[otherNick].viewed = viewed;
            Room.channelz.itemsDef.find((e) => e.id === `${parsed.identity}_${otherNick}`).content = content;
            Room.channelz.onParentResize();
          }
          if (parsed.params[0][0] === '#') {
            const channel = parsed.params[0].toLowerCase();
            const viewed = chanbutt.owner === parsed.identity && chanbutt.name === channel;
            let content = viewed ? `^m>${parsed.params[0]}^` : `^m${parsed.params[0]}^`;
            if (Settings[parsed.identity][channel].mentioned) {
              content = viewed ? `^C>${parsed.params[0]}^` : `^C${parsed.params[0]}^`;
            }
            Settings[parsed.identity][channel].viewed = viewed;
            Room.channelz.itemsDef.find((e) => e.id === `${parsed.identity}_${channel}`).content = content;
            Room.channelz.onParentResize();
          }
        }
        Room.changePrompt(EscapeCarets(Settings[chanbutt?.owner]?.nickname));
        Update();
      }
    }
    if (connection.UpdateScreen !== true) {
      connection.client.on('data', UpdateScreen);
      connection.client.on('timeout', Update);
      connection.client.on('error', Update);
      connection.UpdateScreen = true;
    }
  });
  term.hideCursor(true);
}

module.exports = { ScreenUpdate };
