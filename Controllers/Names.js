const Settings = require('../settings');

const channelNicknames = {};

function GETNAMES(parsed) {
  const chanNicks = parsed.params.slice(3);
  if (!channelNicknames[parsed.identity]) channelNicknames[parsed.identity] = [];
  channelNicknames[parsed.identity].push(...chanNicks);
}

function SHOWNAMES(parsed) {
  const channel = parsed.params[1].toLowerCase();
  const incomingIdentity = parsed.identity;
  const newlist = channelNicknames[parsed.identity].reduce((result, nick) => {
    if (nick && nick !== ' ') {
      if ((/[@%&+~]/).test(nick[0])) {
        const prefix = nick.split('').reduce((acc, curr) => {
          if ((/[@%&+~]/).test(curr)) acc.push(curr);
          return acc;
        }, []);
        result.push({ nickname: nick.slice(prefix.length), prefix });
        return result;
      }
      result.push({ nickname: nick, prefix: false });
    }
    return result;
  }, []);

  Settings[incomingIdentity][`${channel}`].chanNicks = newlist;
  channelNicknames[parsed.identity] = [];
}

module.exports = { GETNAMES, SHOWNAMES };
