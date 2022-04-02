const { EscapeCarets } = require('../Helpers/EscapeCarets');

function HandleKill(client, raw) {
  const temp = raw.split(':').slice(1);
  const msg = EscapeCarets(`(${temp[0]}:${temp[1]})`);
  client.emit('error', msg);
}

module.exports = { HandleKill };
