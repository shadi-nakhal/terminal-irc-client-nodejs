
function FlagsParser(arr) {
    let server;
    let port;
    let nickname
    let user;
    let realname;
    let password;
    let serverpassword;
    let channels;

    for (let i = 0; i < arr.length; i++) {

        if (arr[i] === "-s") {
            if (arr[i + 1] && arr[i + 1].includes(":")) {
                server = arr[i + 1].split(":")[0]
                port = arr[i + 1].split(":")[1]
            } else {
                return { status: "error", data: "invalid server -s followed by server irc.example.net:3333"}
            }
        }
        if (arr[i] === "-n") {
            if (arr[i + 1] && arr[i + 1].length > 2) {
                nickname = arr[i + 1]
            } else {
                return { status: "error", data: "invalid nickname"}
            }

        }
        if (arr[i] === "-u") {
            if (arr[i + 1] && arr[i + 1].length > 2) {
                user = arr[i + 1]
            } else {
                return { status: "error", data: "invalid user"}
            }
        }
        if (arr[i] === "-p") {
            if (arr[i + 1] && arr[i + 1].length > 2) {
                password = arr[i + 1]
            } else {
                return { status: "error", data: "invalid password"}
            }
        }
        if (arr[i] === "-sp") {
            if (arr[i + 1] && arr[i + 1].length > 2) {
                serverpassword = arr[i + 1]
            } else {
                return { status: "error", data: "invalid server password"}
            }
        }
        if (arr[i] === "-r") {
            if (arr[i + 1] && arr[i + 1].length > 2) {
                if (arr[i + 1].includes('"')) {
                    let firstIndex = i + 1 // finding 1st quote
                    let findNextFlagTempvar = arr.indexOf(arr.slice(firstIndex + 1).filter(e => e.includes('-'))[0])
                    let findNextFlag = findNextFlagTempvar !== -1 ?  findNextFlagTempvar : arr.length // finding next flag
                    let secondIndex = arr.indexOf(arr.slice(firstIndex + 1, findNextFlag).filter(e => e.includes('"'))[0]) + 1 // finding 2nd quotes
                    realname = secondIndex ? arr.slice(firstIndex, secondIndex).join(" ").slice(1, -1) : arr[i + 1].slice(1, -1) // ternary if theres
                }                                                     // a second word with quote be it if not then be the 1st word with quote
            } else {
                return { status: "error", data: "invalid realname"}
            }
        }
        if (arr[i] === "-c") {
            if (arr[i + 1] && arr[i + 1].length > 2) {
                if (arr[i + 1].includes('"')) {
                    let firstIndex = i + 1 // finding 1st quote
                    let findNextFlagTempvar = arr.indexOf(arr.slice(firstIndex + 1).filter(e => e.includes('-'))[0])
                    let findNextFlag = findNextFlagTempvar !== -1 ?  findNextFlagTempvar : arr.length // finding next flag
                    let secondIndex = arr.indexOf(arr.slice(firstIndex + 1, findNextFlag).filter(e => e.includes('"'))[0]) + 1 // finding 2nd quotes
                    channels = secondIndex ? arr.slice(firstIndex, secondIndex).join(" ").slice(1, -1).split(" ") : [arr[i + 1].slice(1, -1)] // ternary if theres
                }                                                    // a second word with quote be it if not then be the 1st word with quote
            } else {
                return { status: "error", data: "invalid channels"}
            }
        }

    }

    return {server, port, nickname, user, realname, password, serverpassword, channels}
}


module.exports = { FlagsParser }


