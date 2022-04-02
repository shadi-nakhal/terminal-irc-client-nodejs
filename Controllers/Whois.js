const Settings = require('../settings');

let whois = [];

function IdleTime(secs, signed) {
  // finding idle time
  const idle = new Date(0);
  idle.setSeconds(secs);
  const idleString = idle.toISOString().split('.')[0].split('T')[1];
  const signedOn = new Date(0);
  signedOn.setSeconds(signed);
  const sign = signedOn.toISOString().split('.')[0].split('T').reverse();
  return { idle: idleString, signedon: sign };
}

function WHOISUSER(params) {
  // RPL_WHOISUSER (311)
  whois = [];
  const p = params;
  const msg1 = `[${p[1]}] (${p[2]}@${p[3]}) ${p[5]}`;
  whois.push(msg1);
}

function WHOISSERVER(params) {
  // RPL_WHOISSERVER (312)
  const p = params;
  const msg2 = `[${p[1]}] ${p.slice(2).join(' ')}`;
  whois.push(msg2);
}

function WHOISCHANNELS(params) {
  // RPL_WHOISCHANNELS (319)
  const p = params;
  const msg3 = `[${p[1]}] ${p.slice(2).join(' ')}`;
  whois.push(msg3);
}

function WHOISIDLE(params) {
  // RPL_WHOISIDLE (317)
  const p = params;
  const time = IdleTime(p[2], p[3]);
  const msg4 = `[${p[1]}] idle ${time.idle}, signon ${time.signedon[0]}, ${time.signedon[1]}`;
  whois.push(msg4);
}

function ENDOFWHOIS(parsed) {
  // RPL_ENDOFWHOIS (318)
  const p = parsed.params;
  const { chanbutt } = Settings;
  const chan = Settings.chanbutt.name.toLowerCase();
  const msg4 = `[${p[1]}] ${p.slice(2).join(' ')}`;
  whois.push(msg4);
  if (chanbutt.type === 'server') {
    whois.forEach((ms) => {
      Settings[parsed.identity].status += `^y* ${ms}^\r\n`;
    });
  }
  if (chanbutt.type === 'channel') {
    whois.forEach((ms) => {
      Settings[parsed.identity][chan].logs += `^y* ${ms}^\r\n`;
    });
  }
  whois = [];
}

module.exports = {
  WHOISUSER, WHOISSERVER, WHOISCHANNELS, WHOISIDLE, ENDOFWHOIS
};
