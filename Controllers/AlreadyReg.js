const Settings = require('../settings');

function AlreadyReg(parsed, client) {
  const incomingnickName = parsed.params[0];
  Settings[parsed.identity].nickname = incomingnickName;
  client.write(`PING ${Settings[parsed.identity].nickname}\r\n`);
}

module.exports = { AlreadyReg };
