const Settings = require('../settings');
const { EscapeCarets } = require('../Helpers/EscapeCarets');

function NICKNAMEINUSE(client, parsed, ident) {
  // ERR_NICKNAMEINUSE (433)
  const count = Settings[ident]?.count;
  const newPrefix = parsed.prefix.split('!')[1];
  if (!Settings[ident].PassedMOTD) {
    if (Settings.nicknames[count]) {
      // checking nicknames list using the user's count var
      const nick = Settings.nicknames[count];
      client.write(`NICK ${nick}\r\n`);
      Settings[ident].nickname = nick;
      Settings[ident].prefix = `${nick}!${newPrefix}`;
      Settings[ident].count++;
    } else {
      const nick = Settings.nicknames[0] + Settings[ident].count;
      Settings[ident].prefix = `${nick}!${newPrefix}`;
      client.write(`NICK ${nick}\r\n`);
      Settings[ident].nickname = nick;
    }
  }
}

function CHANGEDNICK(parsed, identity) { // on NICK command
  let nickname = parsed.prefix.split('!')[0];
  const newNick = parsed.params[0];
  if (Settings[identity].nickname === nickname) {
    nickname = Settings[identity].nickname;
    Settings[identity].prefix = `${parsed.params[0]}!${parsed.params[1]}`;
    Settings[identity].nickname = parsed.params[0];
  }
  Settings[identity].joinedChans.forEach((element) => {
    if (Settings[identity][element].chanNicks.some((nick) => nick.nickname === nickname)) {
      Settings[identity][element].chanNicks = Settings[identity][element].chanNicks.map((obj) => {
        if (obj.nickname === nickname) return { ...obj, nickname: parsed.params[0] };
        return obj;
      });
      Settings[identity][element].logs += `^Y**${EscapeCarets(nickname)} is now known as ${EscapeCarets(newNick)}^\r\n`;
      
    }
  });
  Settings[identity].status += `^Y**${EscapeCarets(nickname)} is now known as ${EscapeCarets(newNick)}^\r\n`;
}

module.exports = { NICKNAMEINUSE, CHANGEDNICK };
