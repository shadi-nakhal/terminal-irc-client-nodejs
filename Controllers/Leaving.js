const Settings = require('../settings');
const { EscapeCarets } = require('../Helpers/EscapeCarets');

function LEAVING(parsed, identity) {
  const { command } = parsed;
  const leavingNick = parsed.prefix.split('!')[0];
  const leavingMsg = parsed.params.join(' ');
  const channel = parsed.params[0].toLowerCase();
  const leavingPrefix = parsed.prefix;
  const ownNick = Settings[identity].nickname;
  if (command === 'PART') {
    if (leavingNick === ownNick) {
      Settings[identity].joinedChans = Settings[identity].joinedChans.filter((e) => e !== channel);
    }
    const newlist = Settings[identity][channel].chanNicks.filter((obj) => obj.nickname !== leavingNick);
    Settings[identity][channel].chanNicks = newlist;
    if (leavingNick !== ownNick) Settings[identity][channel].logs += `^Y**${EscapeCarets(leavingNick)} (${EscapeCarets(leavingPrefix)}) has left^\r\n`;
  }
  if (command === 'QUIT') {
    const channelsList = Settings[identity].joinedChans; // finding the joined channels
    channelsList.forEach((chan) => {
      if (Settings[identity][chan].chanNicks.some((nick) => nick.nickname === leavingNick)) {
        Settings[identity][chan.toLowerCase()].logs += `^Y**${EscapeCarets(leavingNick)} (${EscapeCarets(leavingPrefix)}) has Quit (${EscapeCarets(leavingMsg)})^\r\n`;
        const newlist = Settings[identity][chan.toLowerCase()].chanNicks.filter((obj) => obj.nickname !== leavingNick);
        Settings[identity][chan].chanNicks = newlist;
      }
    });
    if (Settings[identity].private[leavingNick]) {
      Settings[identity].private[leavingNick].logs += `^Y**${EscapeCarets(leavingNick)} (${EscapeCarets(leavingPrefix)}) has Quit (${EscapeCarets(leavingMsg)})^\r\n`;
    }
  }
  if (command === 'KICK') {
    const nickname = parsed.params[1];
    const channel = parsed.params[0].toLowerCase();
    const message = parsed.params[2];
    if (nickname === Settings[identity].nickname) {
      Settings[identity][channel].chanNicks = [];
      Settings[identity][channel].logs += `^R**${EscapeCarets(leavingNick)} has kicked you ${EscapeCarets(message)}^\r\n`;
      return;
    }
    const newlist = Settings[identity][channel].chanNicks.filter((obj) => obj.nickname !== nickname);

    Settings[identity][channel].chanNicks = newlist;
    Settings[identity][channel].logs += `^Y**${EscapeCarets(leavingNick)} has kicked ${EscapeCarets(nickname)} ${message}^\r\n`;
  }
}

module.exports = { LEAVING };
