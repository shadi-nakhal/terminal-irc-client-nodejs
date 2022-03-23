const fs = require('fs');
const { fsActions } = require('./FsActions')

function HandleFs(config) {
    let promise = new Promise((res, rej) => {
        let serverName = Object.keys(config)
        fs.open('mynewfile1.json', 'wx', (err, fd) => {
            if (err) {
                if (err.code !== 'EEXIST') return rej("error fs.open")
                fs.readFile("mynewfile1.json", (err, file) => {
                    if (err) rej(err)
                    let newjsonFile
                    let jsonFile = {}
                    if (file.length > 0) {
                        try {
                        jsonFile = JSON.parse(file);
                        }catch(err){
                            return rej("error parsing json file")
                        }
                    }
                    if (config[serverName]['action'] === fsActions.show ) {
                        if (jsonFile[serverName]) {
                            return res(jsonFile[serverName])
                            
                        }
                        if (serverName[0] === fsActions.showAll || serverName[0] === fsActions.all ) {
                            return res(jsonFile)
                    
                        }
                        return rej("server not found")
                    }
                    if (config[serverName]['action'] === fsActions.add) {
                        delete config[serverName].action
                        newjsonFile = {
                            ...jsonFile,
                            ...config
                        }
                        res(serverName + " is added")
                    }
                    if (config[serverName]['action'] === fsActions.del) {
                        if (jsonFile[serverName]) {
                            delete jsonFile[serverName]
                            newjsonFile = jsonFile
                            res(serverName + " is deleted")
                        }else {
                          return rej("server not found")
                        }
                    }
                    let newData = JSON.stringify(newjsonFile, null, 2);
                    fs.writeFile("mynewfile1.json", newData, (err) => {
                        if (err) rej(err)
                    });

                })
                return
            }
            let newData = JSON.stringify({});
            fs.writeFile("mynewfile1.json", newData, (err) => {
                if (err) rej(err)
            });
            fs.close(fd, (err) => {
                if (err) rej(err)
            });
            return  res("file is initialized and is empty")
        })
    })
    return promise
}



module.exports = { HandleFs }