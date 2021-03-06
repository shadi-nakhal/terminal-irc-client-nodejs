const fs = require('fs');
const process = require('process');
const { fsActions } = require('./FsActions');

function CreateError(message) {
  const newError = new Error(message);
  return newError;
}

function HandleFs(config) {
  // Internal function
  const _writeConfig = (configJson, callback) => {
    fs.writeFile(
      'config.json',
      JSON.stringify(configJson, null, 2),
      {
        encoding: 'utf8',
        mode: 0o600,
        flag: 'w'
      },
      (err) => {
        callback(err);
      }
    );
  };
  const promise = new Promise((resolve, reject) => {
    const serverName = Object.keys(config);
    fs.readFile('config.json', (err, file) => {
      if (err) {
        reject(err);
      } else {
        let newjsonFile;
        let jsonFile;
        if (file.length > 0) {
          try {
            jsonFile = JSON.parse(file);
          } catch (err) {
            console.logger(err.toString() || err);
            jsonFile = null;
          }
        }
        if (jsonFile == null) {
          reject(CreateError('error parsing json file'));
        } else {
          if (config[serverName].action === fsActions.show) {
            if (jsonFile[serverName]) {
              resolve(jsonFile[serverName]);
            } else if (serverName[0] === fsActions.showAll || serverName[0] === fsActions.all) {
              resolve(jsonFile);
            } else {
              reject(CreateError('server not found'));
            }
          } else if (config[serverName].action === fsActions.add) {
            if(serverName[0].length < 3){
              reject(CreateError("Profile name should be bigger than 3 chars."));
            }
            delete config[serverName].action;
            newjsonFile = {
              ...jsonFile,
              ...config
            };
            const callback = function(err) {
              if (err) {
                reject(err);
              } else {
                resolve(`${serverName} is added`);
              }
            };
            _writeConfig(newjsonFile, callback);
          } else if (config[serverName].action === fsActions.del) {
            if (jsonFile[serverName]) {
              delete jsonFile[serverName];
              newjsonFile = jsonFile;
              const callback = function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve(`${serverName} is deleted`);
                }
              };
              _writeConfig(newjsonFile, callback);
            } else {
              reject(CreateError('server not found'));
            }
          }
        } // if not JSON error error
      } // if not file read error
    }); // fs.readFile()
  }); // new Promise()
  return promise;
}

try {
  if (!fs.existsSync('config.json')) {
    console.log('Config file not found, creating config.json');
    fs.writeFileSync(
      'config.json',
      '{}\n',
      {
        encoding: 'utf8',
        mode: 0o600,
        flag: 'w'
      }
    );
  }
} catch (err) {
  console.log('Unable to create config.json');
  console.log(err.toString() || err);
  process.exit(1);
}

module.exports = { HandleFs };
