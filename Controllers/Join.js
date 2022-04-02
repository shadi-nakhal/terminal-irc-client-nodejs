const Settings = require('../settings');
const { Room } = require('../Components/index');

function JOIN(client, parsed) {
  const incomingChannel = parsed.params[0].toLowerCase();
  const { identity } = parsed;
  const incomingPrefix = parsed.prefix;
  const { joinedChans } = Settings[identity];
  const userServer = Settings[identity].server.toLowerCase();
  const nickname = parsed.prefix.split('!')[0];
  const usernickname = Settings[identity].nickname;

  if (nickname !== usernickname) {
    if (!Settings[identity][incomingChannel]) client.write(`NAMES ${incomingChannel} \r\n`);
    if (Settings[identity][incomingChannel]) {
      Settings[identity][incomingChannel].logs += `^Y**${nickname} (${incomingPrefix})` + ' has joined^\r\n';
    }
    Settings[identity][incomingChannel].chanNicks.push({ nickname, prefix: false });
  }
  if (nickname === usernickname) {
    if (!joinedChans.includes(incomingChannel)) {
      Settings[identity].joinedChans = [...Settings[identity].joinedChans, incomingChannel];
      if (!Settings[identity][incomingChannel]) {
        Settings[identity][incomingChannel] = {
          name: incomingChannel,
          logs: '',
          chanNicks: [],
          main: '',
          topic: ''
        };
      }
      Settings[identity][incomingChannel].chanNicks = [];
      Room.GenerateChannels({
        type: 'channel',
        name: incomingChannel,
        server: userServer,
        owner: identity
      });
    }
  }
}

function SetTopic(parsed) {
  const { identity } = parsed;
  const topic = `${parsed.params.slice(2).join(' ')}\r\n`;
  const channel = parsed.params[1].toLowerCase();
  Settings[identity][channel].topic = topic;
  Settings[identity][channel].logs += topic;
}

module.exports = { JOIN, SetTopic };
