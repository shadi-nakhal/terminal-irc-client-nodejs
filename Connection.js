const net = require('net');
const tls = require('tls');
const Settings = require('./settings');
const { ScreenUpdate } = require('./Helpers/ScreenUpdate');
const { Listener } = require('./Listener');

class Connection extends Listener {
  constructor({server, port, user, realname, nickname, channels, password, serverpassword, tls, rejectUnauthorized}) {
    super();
    this.originalNick = nickname;
    this.nickname = nickname || Settings[this.identity]?.nickname  || Settings.nicknames[0];
    this.server = server;
    this.port = port;
    this.channels = channels;
    this.user = user || Settings.USER;
    this.realname = realname || Settings.realname;
    this.connecting = false;
    this.preError = false;
    this.tlsFlag = tls;
    this.password = password;
    this.serverpassword = serverpassword;
    this.identity;
    this.options = {
      rejectUnauthorized: rejectUnauthorized,
      port: this.port,
      host: this.server
    };
  }

  Start() {
    this.MakeIdentity();
    this.CreateSettings();
    this.Connect();
  }

  MakeIdentity() {
    this.identity = new Date().getTime() + Math.floor(Math.random() * 100);
  }

  CreateSettings() {
    Settings[this.identity] = {
      private: {},
      identity: this.identity,
      nickname: this.nickname,
      server: this.server,
      port: this.port,
      channels: this.channels,
      user: this.user,
      realname: this.realname,
      PassedMOTD: false,
      count: 0,
      joinedChans: [],
      displayRaw : false,
      raw : "",
      status : ""
    };
  }

  RebindClient(client){
    this.client = client;
  }

  Connect() {
    let client = null;
    const { Listen, identity , server, tlsFlag, user, realname, serverpassword, password, originalNick } = this;
    const connect = () => {
      if(this.tlsFlag){
        client = tls.connect(this.options);
      } else {
        client = net.connect(this.options); 
      }
      client.setTimeout(80000);
      this.connecting = false;
      Settings[identity].PassedMOTD = false;
      clearTimeout(Settings[identity].ping);
      clearTimeout(Settings[identity].connect);
      this.preError = false;
      BindEvents(client);
      this.RebindClient(client);
      ScreenUpdate({identity, client, server});
      this.UpdateScreen = true;
    };

    const connectHandler = () => {
      let nickname = Settings[this.identity]?.nickname || this.nickname;
      client.write('CAP LS 302\r\n');
      client.write('CAP REQ multi-prefix\r\n');
      client.write('CAP END\r\n');
      serverpassword ? client.write(`PASS ${serverpassword}\r\n`) : null;
      client.write(`NICK ${nickname}\r\n`);
      client.write(`USER ${user} 0 * :${realname}\r\n`);
      this.connecting = true;
      this.preError = false;
    };

    const reconnect = (err) => {
      if (!this.connecting) {
        this.connecting = true;
        Settings[this.identity].joinedChans.forEach((chan) => {
          Settings[this.identity][chan.toLowerCase()].logs += `^R${err} Reconnecting...^\r\n`;
          Settings[this.identity][chan.toLowerCase()].chanNicks = [];
        });
      }
      if (client) {
        client.destroy();
        client = null;
      }
      Settings[this.identity].connect = setTimeout(connect, 5000);
      Settings[this.identity].status += `^R${err} Reconnecting...^\r\n`;
    };

    const errorHandler = (err) => {
      console.logger(err);
      this.connecting = false;
      if (!this.preError) {
        this.preError = true;
        reconnect(err);
      }
    };

    const Timeout = () => {
      this.connecting = false;
      const error = new Error('Ping Timeout');
      if (!this.preError) {
        this.preError = true;
        reconnect(error);
      }
    };

    const Close = () => {
      this.connecting = false;
      const error = new Error('Socket is closed');
      if (!this.preError) {
        this.preError = true;
        reconnect(error);
      }
    };

    function BindEvents(client){
      client.on('error', errorHandler);
      tlsFlag ? client.on('secureConnect', connectHandler) :
      client.on('connect', connectHandler);
      client.on('timeout', Timeout);
      client.on('close', Close);
      client.on("data", (data) => Listen(data, identity, client, server, password, originalNick));
      
    }

    connect();
  }


}

module.exports = { Connection };
