
function parser(data, identity) {
    let message = {
        raw: data,
        command: null,
        params: []
    }
    let splitdata = data.split(" ")
    if(data[0] !== ":"){
        message.command = splitdata[0]
        message.params = splitdata[1]
        message.identity = identity
        return message
    }
    message.prefix = splitdata[0].replace(":", "")
    message.command = splitdata[1]
    message.params = splitdata.slice(2).join(" ").replace(":", "").split(" ")
    message.identity = identity
    return message;
}

module.exports = parser
