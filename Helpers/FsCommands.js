const { FlagsParser } = require('./FlagsParser');
const { HandleFs } = require('./HandleFs');
const { fsActions } = require('./FsActions');

async function ConnectCommand(incoming) {
  if (Array.isArray(incoming) && incoming.length > 1) {
    if (incoming.length === 2) {
      const data = HandleFs({
        [incoming[1]]: {
          server: [incoming[1]],
          action: fsActions.show
        }
      });
      return data;
    }
    return FlagsParser(incoming);
  }
  return '/connect "" is not a command';
}

function ServerCommand(incoming) {
  const {
    server,
    port,
    nickname,
    user,
    realname,
    password,
    serverpassword,
    tls,
    rejectUnauthorized,
    channels
  } = FlagsParser(incoming);
  const config = {};
  switch (incoming[1]) {
    case fsActions.add:
      if (incoming[2] && server && port) {
        config[incoming[2]] = {
          server,
          port,
          nickname,
          user,
          realname,
          password,
          serverpassword,
          channels,
          tls,
          rejectUnauthorized,
          action: fsActions.add
        };
        const data = HandleFs(config);
        return data;
      }
      break;
    case fsActions.del:
      if (incoming[2]) {
        config[incoming[2]] = {
          server: incoming[2],
          action: fsActions.del
        };
        const data = HandleFs(config);
        return data;
      }
      break;
    case fsActions.show: {
      if (incoming[2]) {
        config[incoming[2]] = {
          server: incoming[2],
          action: fsActions.show
        };
      } else {
        config.showAll = {
          action: fsActions.show
        };
      }
      const data = HandleFs(config);
      return data;
    }
    default:
      return `/server ${incoming[1]} is not a command`;
  }
  return `Incorrect Entry`;
}

module.exports = { ServerCommand, ConnectCommand };
