const {
  WHOISUSER,
  WHOISSERVER,
  WHOISCHANNELS,
  WHOISIDLE,
  ENDOFWHOIS
} = require('./Whois');
const { PING } = require('./Ping');
const { NICKNAMEINUSE, CHANGEDNICK } = require('./Nick');
const { LEAVING } = require('./Leaving');
const { JOIN, SetTopic } = require('./Join');
const { GETNAMES, SHOWNAMES } = require('./Names');
const { MOTD } = require('./MOTD');
const { WELCOME, SERVERINFO } = require('./Welcome');
const { PRIVMSG } = require('./Privmsg');
const { MODE, ShowChanModes,ShowChanDate, ShowBanList,ShowEndOfBanList } = require('./MODE');
const { HandleKill } = require('./ERROR');
const { AlreadyReg } = require('./AlreadyReg');
const { Notice } = require('./NOTICE');
const { Status } = require('./Status');



module.exports = {
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
  HandleKill,
  AlreadyReg,
  Notice,
  Status
};
