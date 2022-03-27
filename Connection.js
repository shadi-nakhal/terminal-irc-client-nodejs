const net = require('net')
const Settings = require('./settings')

class Connecting{
    constructor(server, port, user, realname, nickname, channels){
        this.nickname = nickname || Settings.nicknames[0]
        this.server = server
        this.port = port
        this.channels = channels
        this.user = user || Settings.USER
        this.realname = realname || Settings.realname
        this.connecting = false
        this.client;
        this.MakeIdentity()
        this.CreateSettings()
    }

    Connect(){
        const client = new net.Socket()
        this.client = client
        let connect = () => {
            client.connect(this.port, this.server)
            this.connecting = false;
            Settings[this.identity].PassedMOTD = false
            clearTimeout(Settings[this.identity]['timeout'])
            clearTimeout(Settings[this.identity]['ping'])
            clearTimeout(Settings[this.identity]['connect'])
            Settings[this.identity].disconnected = false
            Settings[this.identity].joinedChans.forEach(chan => {
                Settings[this.identity][chan.toLowerCase()].logs +=`^Gconnected!^\r\n` 
            })
        }

        let connectHandler = () =>{
            client.write(`CAP LS 302\r\n`);
            client.write(`CAP REQ multi-prefix\r\n`);
            client.write(`CAP END\r\n`);
            client.write(`NICK ${this.nickname}\r\n`);
            client.write(`USER ${this.user} 0 * :${this.realname}\r\n`);

        }

        let errorHandler =(err)=> {
            // if(err?.code === 'EISCONN') return
            if (!this.connecting) {
                this.connecting = true;
                Settings[this.identity].disconnected = true
                Settings[this.identity].joinedChans.forEach(chan => {
                    Settings[this.identity][chan.toLowerCase()].logs +=`^R${err} Reconnecting...^\r\n` 
                    // Settings[this.identity][chan]['chanNicks'] = []
                })
            }
            Settings[this.identity]['connect'] = setTimeout(connect, 5000)
            Settings[this.identity].status += `^R${err} Reconnecting...^\r\n`
            
        }

        client.on('error',   errorHandler);
        client.on('connect',   connectHandler);
        client.on('timeout', errorHandler);

        connect()
    }

    CreateSettings(){
        Settings[this.identity] = {
            disconnected: this.connecting,
            private : {},
            identity : this.identity,
            nickname : this.nickname,
            server : this.server,
            port : this.port,
            channels : this.channels,
            user : this.user,
            realname : this.realname,
            PassedMOTD : false,
            count : 0,
            joinedChans : []
        }
    }

    MakeIdentity(){
        this.identity = new Date().getTime() + Math.floor(Math.random() * 100)
    }

}


module.exports = { Connecting }