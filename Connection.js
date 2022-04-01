const net = require('net')
const Settings = require('./settings')

class Connecting{
    constructor(server, port, user, realname, nickname, channels){
        this.nickname = Settings[this.identity]?.nickname || nickname || Settings.nicknames[0]
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
        this.preError = true
        client.setTimeout(80000)
        let connect = () => {
            client.connect(this.port, this.server)
            client.setTimeout(80000)
            this.connecting = false;
            Settings[this.identity].PassedMOTD = false
            clearTimeout(Settings[this.identity]['timeout'])
            clearTimeout(Settings[this.identity]['ping'])
            clearTimeout(Settings[this.identity]['connect'])
            this.preError = false
        }

        let connectHandler = () =>{
            client.write(`CAP LS 302\r\n`);
            client.write(`CAP REQ multi-prefix\r\n`);
            client.write(`CAP END\r\n`);
            client.write(`NICK ${this.nickname}\r\n`);
            client.write(`USER ${this.user} 0 * :${this.realname}\r\n`);
            this.connecting = true
            this.preError = false

        }

        let reconnect = (err) => {
            if (!this.connecting) {
                this.connecting = true;
                Settings[this.identity].joinedChans.forEach(chan => {
                    Settings[this.identity][chan.toLowerCase()].logs +=`^RReconnecting...^\r\n`
                    Settings[this.identity][chan.toLowerCase()]['chanNicks'] = []
                })
            }
            client.destroy()
            Settings[this.identity]['connect'] = setTimeout(connect, 5000)
            Settings[this.identity].status += `^R${err} Reconnecting...^\r\n`
        }

        let errorHandler =(err)=> {
            this.connecting = false;
            if(!this.preError){
                this.preError = true
                reconnect(err)
            }
        }

        let Timeout = () => {
            this.connecting = false;
            const error = new Error("Ping Timeout");
            if(!this.preError){
                this.preError = true
                reconnect(error)
            }
        }

        client.on('error',   errorHandler);
        client.on('connect',   connectHandler);
        client.on('timeout', Timeout);
        client.on('close', (err)=> {
            this.connecting = false;
            const error = new Error("Socket is closed");
            if(!this.preError){
                this.preError = true
                reconnect(error)
            }
        });

        connect()
    }

    CreateSettings(){
        Settings[this.identity] = {
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