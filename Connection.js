const net = require('net');
const tls = require('tls');
// const { ReStartTls } = require('./Helpers/ConnectionsPool');

const Settings = require('./settings');

const IrcParser = require("./Helpers/IrcParser");

const {
    WHOISUSER,
    WHOISSERVER,
    WHOISCHANNELS,
    WHOISIDLE,
    ENDOFWHOIS,
    PING,
    NICKNAMEINUSE,
    CHANGEDNICK,
    LEAVING,
    JOIN,
    GETNAMES,
    HandleKill,
    SHOWNAMES,
    MOTD,
    WELCOME,
    SERVERINFO,
    PRIVMSG,
    SetTopic,
    MODE,
    ShowChanModes,
    ShowChanDate,
    ShowBanList,
    ShowEndOfBanList,
    AlreadyReg,
    Notice,
    Status
} = require("./Controllers/index");
const { ScreenUpdate } = require('./Helpers/ScreenUpdate');

class Connecting {
  constructor(server, port, user, realname, nickname, channels, tlsFlag) {
    this.nickname = Settings[this.identity]?.nickname || nickname || Settings.nicknames[0];
    this.server = server;
    this.port = port;
    this.channels = channels;
    this.user = user || Settings.USER;
    this.realname = realname || Settings.realname;
    this.connecting = false;
    this.preError = false;
    this.tlsFlag = tlsFlag;
    this.identity;
    this.options = {
      rejectUnauthorized: false,
      port: this.port,
      host: this.server
    };
  }

  MakeIdentity() {
    this.identity = new Date().getTime() + Math.floor(Math.random() * 100);
  }

  RebindClient(client){
    this.client = client;
  }

  Connect() {
    let client = new net.Socket();
    const { Listen, identity , server } = this;
    client.setTimeout(80000);
    const connect = () => {
      if(this.tlsFlag && !this.preError){
        client = tls.connect(this.options);
      }
      if(this.tlsFlag && this.preError){
        client = tls.connect(this.options);
        BindEvents(client);
        this.RebindClient(client);
        ScreenUpdate({identity, client, server});
      }
      if(!this.tlsFlag){
      client.connect(this.options);
      }
      
      client.setTimeout(80000);
      this.connecting = false;
      Settings[this.identity].PassedMOTD = false;
      clearTimeout(Settings[this.identity].timeout);
      clearTimeout(Settings[this.identity].ping);
      clearTimeout(Settings[this.identity].connect);
      if(!this.preError){
        BindEvents(client);
        this.RebindClient(client);
      }
      this.preError = false;

    };

    const connectHandler = () => {
      client.write('CAP LS 302\r\n');
      client.write('CAP REQ multi-prefix\r\n');
      client.write('CAP END\r\n');
      client.write(`NICK ${this.nickname}\r\n`);
      client.write(`USER ${this.user} 0 * :${this.realname}\r\n`);
      this.connecting = true;
      this.preError = false;
    };

    const reconnect = (err) => {
      if (!this.connecting) {
        this.connecting = true;
        Settings[this.identity].joinedChans.forEach((chan) => {
          Settings[this.identity][chan.toLowerCase()].logs += '^RReconnecting...^\r\n';
          Settings[this.identity][chan.toLowerCase()].chanNicks = [];
        });
      }
      client.destroy();
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
      console.logger('binding events!');
      client.on('error', errorHandler);
      client.on('connect', connectHandler);
      client.on('timeout', Timeout);
      client.on('close', Close);
      client.on("data", (data) => Listen(data, identity, client, server));
      
    }

    connect();
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


  Listen(data, identity, client, server){
    let message = [];
    let temp = "";

    data = data.toString();
    let len = data.length - 1;
    buffer(data);
    function buffer(data) {
        if (data[len] !== "\n") {
            return temp += data;

        }
        if (data[len] === "\n") {
            if (temp.length > 0) {
                message.push(temp + data);
                temp = "";
                return;
            }
            if (data.length > 0) message.push(data);
        }
    }
    const rnparse = message.flatMap((e) => e.split("\r\n"));
    for (const raw of rnparse) {
        if (raw.length > 0) {
            const parsed = IrcParser(raw, identity);
            const { command, params } = parsed;
            Status(parsed);
            if (command === "001") WELCOME(params, identity, client); // RPL_WELCOME (001)
            if (command === "004") SERVERINFO(identity, server); // RPL_MYINFO (004) server info
            if (command === "462") AlreadyReg(parsed, client);
            if (command === "376" || command === "422") MOTD(client, parsed); // RPL_MOTD (372)
            if (command === "433") NICKNAMEINUSE(client, parsed, identity); // ERR_NICKNAMEINUSE (433)
            if (command === "ERROR") HandleKill(client, raw);
            if (command === "NOTICE") Notice(parsed);
            if (command === "PING" || command === "PONG") PING(parsed, params, client);
            if (command === "353") GETNAMES(parsed); // RPL_NAMREPLY (353
            if (command === "366") SHOWNAMES(parsed); // RPL_ENDOFNAMES (366)'
            if (command === "NICK") CHANGEDNICK(parsed, identity);
            if (command === "JOIN") JOIN(client, parsed);
            if (command === "PART" || command === "QUIT" || command === "KICK") LEAVING(parsed, identity);
            if (command === "311") WHOISUSER(params);
            if (command === "312") WHOISSERVER(params, client);
            if (command === "319") WHOISCHANNELS(params, client);
            if (command === "317") WHOISIDLE(params, client);
            if (command === "318") ENDOFWHOIS(parsed, client);
            if (command === "332") SetTopic(parsed);
            if (command === "PRIVMSG") PRIVMSG(parsed, client);
            if (command === "MODE") MODE(parsed);
            if(command === "324") ShowChanModes(parsed);
            if(command === "329") ShowChanDate(parsed);
            if(command === "367") ShowBanList(parsed);
            if(command === "368") ShowEndOfBanList(parsed);
            message.pop();
        }
    }
}



}

module.exports = { Connecting };
