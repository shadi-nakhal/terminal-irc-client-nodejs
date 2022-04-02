const Settings = require('../settings');

function WELCOME(params, identity, client) {
  const incomingnickName = params[0];
  Settings[identity].nickname = incomingnickName;
  client.write(`PING ${Settings[identity].nickname}\r\n`); // initiating 1st ping to detect timeouts
}

function SERVERINFO(identity, server) {
  Settings[identity].server = server;
}

module.exports = { WELCOME, SERVERINFO };
