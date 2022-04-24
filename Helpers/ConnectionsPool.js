const Settings = require('../settings');

const { Listener } = require('../Listener');
const { Room } = require('../Components');
const { ScreenUpdate } = require("./ScreenUpdate");

let Pool = [];

function SpinnConnection(instances) {
  const channelsToGenerate = [];
  for (const i of instances) {
    const newcon = new Listener(i);
    newcon.Start();
    Pool.push(newcon);
    ScreenUpdate(newcon);
    channelsToGenerate.push({ type: 'server', name: newcon.server, owner: newcon.identity });
    Room.GenerateChannels({ type: 'server', name: newcon.server, owner: newcon.identity });
  }
  return channelsToGenerate;
}

function RemoveCon(identity) {
  const target = Pool.find((pro) => pro.identity === identity);
  clearTimeout(Settings[identity].timeout);
  clearTimeout(Settings[identity].ping);
  clearTimeout(Settings[identity].connect);
  target.connecting = false;
  Settings[identity].PassedMOTD = false;
  target.client.removeAllListeners();
  target.client.destroy();
  Pool = Pool.filter((pro) => pro.identity !== identity);
}

function FindCon(identity) {
  const con = Pool.find((pro) => pro.identity === identity);
  return con;
}

function ReStartTls(identity) {
  const con = Pool.find((pro) => pro.identity === identity);
  con.Start();
}

function connectionsPool() {
  return Pool;
}

module.exports = {
  SpinnConnection, FindCon, RemoveCon, connectionsPool, ReStartTls
};
