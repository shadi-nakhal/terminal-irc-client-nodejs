const Settings = require("../settings");

function Status(parsed) {
    const date = `${new Date().toTimeString().slice(0, 8)}`;
    const { command, params, identity, raw } = parsed;

    if (
        !(
            command === "PING" ||
            command === "NOTICE" ||
            command === "PONG" ||
            command === "NICK" ||
            command === "JOIN" ||
            command === "NAMES" ||
            command === "PART" ||
            command === "QUIT" ||
            command === "KICK" ||
            command === "311" ||
            command === "333" ||
            command === "312" ||
            command === "319" ||
            command === "318" ||
            command === "332" ||
            command === "366" ||
            command === "353" ||
            command === "367" ||
            command === "368" ||
            command === "MODE" ||
            command === "ERROR" ||
            command === "PRIVMSG"
        )
    ) {
        try{ 
        Settings[identity].status += `${date}: ${params.slice(1).join(" ")}\r\n`;
        }catch(err){
            Settings[identity].status += `^R${date}: ${raw}^\r\n`;
        }
    }
    Settings[identity].raw += `${date}: ${raw}\r\n`;
}

module.exports = { Status };
