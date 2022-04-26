const Settings = require('../settings');

function WELCOME(params, identity, client, password, originalNick) {
  const incomingnickName = params[0];
  client.write(`PING ${Settings[identity].nickname}\r\n`); // initiating 1st ping to detect timeouts
  if(password && originalNick){
  client.write(`ns identify ${originalNick} ${password}\r\n`);
}
  Settings[identity].nickname = incomingnickName;


}

function SERVERINFO(identity, server) {
  Settings[identity].server = server;
}

module.exports = { WELCOME, SERVERINFO };
