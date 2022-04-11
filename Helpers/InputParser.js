const { ServerCommand, ConnectCommand } = require('./FsCommands');
const {
  SpinnConnection, FindCon, RemoveCon, connectionsPool
} = require('./ConnectionsPool');
const { DisplayInfo } = require('./DisplayInfo');
const { Room } = require('../Components');
const { term } = require('../Dom');
const { ScreenUpdate } = require('./ScreenUpdate');
const { Update, Clear} = require('./Update');
const process = require('process');

const Settings = require('../settings');

async function InputParser(data) {
  let incoming = data;
  const { chanbutt } = Settings;
  const notFrankenstein = chanbutt?.type !== 'Frankenstein';
  let connection;
  if (chanbutt) connection = FindCon(chanbutt.owner);
  let channel; let message; let nick; let channelId; let mode;
  if (data[0] === '/') {
    incoming = data.split(' ');
    Room.input.setContent('');
    switch (incoming[0].toLowerCase()) {
      case '/server':
        try {
          const serverCommand = await ServerCommand(incoming);
          return { data: DisplayInfo(serverCommand), command: true };
        } catch (err) {
          return { data: err, command: true };
        }
      case '/connect':
        try {
          const {
            server, port, user, realname, nickname, channels
          } = await ConnectCommand(incoming);
          const spinnedServer = SpinnConnection([{
            server, port, user, realname, nickname, channels
          }]);
          spinnedServer.map((chan) => Room.GenerateChannels(chan));
          ScreenUpdate();
          return;
        } catch (err) {
          return { data: err, command: true };
        }
      case '/part':
        if (chanbutt?.type === 'channel') {
          connection.client.write(`PART ${chanbutt.name}\r\n`);
          channelId = `${chanbutt.owner}_${chanbutt.name}`;
          Room.channelz.children
            .find((btn) => btn.value.type === 'server' && btn.value.owner === chanbutt.owner)
            .submit();
          Room.DestroyChannel(channelId);
        }
        return;
      case '/close':
        if (chanbutt?.type === 'private') {
          Settings[chanbutt.owner].private[chanbutt.name].exists = false;
          channelId = `${chanbutt.owner}_${chanbutt.name}`;
          Room.channelz.children
            .find((btn) => btn.value.type === 'server' && btn.value.owner === chanbutt.owner)
            .submit();
          Room.DestroyChannel(channelId);
        }
        return;
      case '/query':
        nick = incoming[1];
        if (nick && notFrankenstein) {
          if (!Settings[chanbutt.owner].private) Settings[chanbutt.owner].private = {};
          if (!Settings[chanbutt.owner].private[nick]) Settings[chanbutt.owner].private[nick] = {};
          if (!Settings[chanbutt.owner].private[nick].exists) {
            Room.GenerateChannels({ name: nick, type: 'private', owner: chanbutt.owner });
            if (!Settings[chanbutt.owner].private[nick].logs) {
              Settings[chanbutt.owner].private[nick].logs = '';
            }
            Settings[chanbutt.owner].private[nick].exists = true;
          }
          Room.channelz.children
            .find((btn) => btn.value.type === 'private' && btn.value.name === nick)
            .submit();
        }
        return;
      case '/join':
        channel = incoming[1]?.toLowerCase();
        if (notFrankenstein) connection.client.write(`JOIN ${channel}\r\n`);
        return;
      case '/quit':
        if (!notFrankenstein) {
          term.reset();
          process.exit();
        }
        message = incoming.slice(1).join(' ');
        connection.client.write(`QUIT :${message}\r\n`);
        Room.channelz.children
          .filter((chan) => chan.value.owner === connection.identity)
          .map((e) => Room.DestroyChannel(e.key));
        RemoveCon(connection.identity);
        Room.channelz.children[Room.channelz.children.length - 1].submit();
        Room.changePrompt('');
        return;
      case '/me':
        if (incoming[1] && notFrankenstein) {
          connection.client.write(
            `PRIVMSG ${chanbutt.name} :\u0001ACTION ${incoming.slice(1).join(' ')}\u0001\r\n`
          );
          Settings[chanbutt.owner][chanbutt.name].logs += `^m* ${Settings[chanbutt.owner].nickname} ${incoming
            .slice(1)
            .join(' ')}^\r\n`;
          Room.Main.setContent(Settings[chanbutt.owner][chanbutt.name].logs, true, true);
          Room.Main.scrollToBottom();
        }
        return;
      case '/nick':
        if (incoming[1] && notFrankenstein) connection.client.write(`NICK ${incoming[1]}\r\n`);
        return;
      case '/kick':
        message = incoming[2] || 'Eeee-yah!';
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          connection.client.write(`KICK ${channel} ${subject} ${message}\r\n`);
        }
        return;
      case '/op':
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          connection.client.write(`mode ${channel} +o ${subject}\r\n`);
        }
        return;
      case '/deop':
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          connection.client.write(`mode ${channel} -o ${subject}\r\n`);
        }
        return;
      case '/ban':
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          connection.client.write(`mode ${channel} +b ${subject}\r\n`);
        }
        return;
      case '/unban':
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          connection.client.write(`mode ${channel} -b ${subject}\r\n`);
        }
        return;
      case '/voice':
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          connection.client.write(`mode ${channel} +v ${subject}\r\n`);
        }
        return;
      case '/devoice':
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          connection.client.write(`mode ${channel} -v ${subject}\r\n`);
        }
        return;
      case '/whois':
        if (incoming[1] && notFrankenstein) connection.client.write(`whois ${incoming[1]}\r\n`);
        return;
      case '/mode':
        if (notFrankenstein) {
          const { channel, subject } = ParseIncoming(incoming, chanbutt);
          if(subject.toLowerCase() === Settings[chanbutt.owner].nickname.toLowerCase()){
            mode = incoming[2] || "";
            connection.client.write(`mode ${subject} ${mode}\r\n`);
          }else
          connection.client.write(`mode ${channel} ${subject}\r\n`);
        }
        return;
      case '/test':
        Getlisteners();
        return;
      case '/error':
        connection.client.emit('error', 'invoked error');
        return;
      case '/timeout':
        connection.client.emit('timeout', 'ping timeout');
        return;
      case '/raw':
        Settings[chanbutt.owner].displayRaw = !Settings[chanbutt.owner].displayRaw;
        Update();
        return;
      case '/memory':
         return { data : DisplayInfo(GetmemoryUsage()), command: true};
      case '/clear':
        Clear();
        Update();
        return;
    }
    return { data: `${incoming[0]} is not a command`, command: true };
  }

  return { data: incoming, command: false };
}

function ParseIncoming(incoming, chanbutt) {
  let channel = chanbutt.name;
  let subject = incoming[1] || '';
  if (incoming[1]) {
    if (incoming[1][0] === '#' || incoming[1][0] === '&') {
      channel = incoming[1];
      subject = incoming[2] || '';
    }
  }
  return { channel, subject };
}

function Getlisteners() {
  connectionsPool().forEach((con) => {
    console.logger(con.client.listeners('data'), 'listening on data');
    console.logger(con.client.listenerCount('data'), 'data listeners');
    console.logger(con.client.listenerCount('timeout'), 'timeout listeners');
    console.logger(con.client.eventNames(), 'event names');
    console.logger(connectionsPool().length, 'connections');
    console.logger('-----------------------');
  });
}

function GetmemoryUsage() {
  let memoryObject = {};
  let memoryUsage = process.memoryUsage();
  for (let key in memoryUsage){
    memoryObject[key] = Math.round(memoryUsage[key] / 1024/ 1024 * 100) / 100 + " MB";
  }
  return memoryObject;
}

module.exports = { InputParser };