const fs = require('fs');
const { fsActions } = require('./FsActions');

function CreateError(message) {
  const newError = new Error(message);
  return newError;
}

function HandleFs(config) {
  const promise = new Promise((resolve, reject) => {
    const serverName = Object.keys(config);
    fs.open('config.json', 'wx', (err, fd) => {
      if (err) {
        if (err.code !== 'EEXIST') {
          return reject(CreateError('error fs.open'));
        }
        fs.readFile('config.json', (err, file) => {
          if (err) reject(err);
          let newjsonFile;
          let jsonFile = {};
          if (file.length > 0) {
            try {
              jsonFile = JSON.parse(file);
            } catch (err) {
              return reject(CreateError('error parsing json file'));
            }
          }
          if (config[serverName].action === fsActions.show) {
            if (jsonFile[serverName]) {
              return resolve(jsonFile[serverName]);
            }
            if (serverName[0] === fsActions.showAll || serverName[0] === fsActions.all) {
              return resolve(jsonFile);
            }
            return reject(CreateError('server not found'));
          }
          if (config[serverName].action === fsActions.add) {
            delete config[serverName].action;
            newjsonFile = {
              ...jsonFile,
              ...config
            };
            resolve(`${serverName} is added`);
          }
          if (config[serverName].action === fsActions.del) {
            if (jsonFile[serverName]) {
              delete jsonFile[serverName];
              newjsonFile = jsonFile;
              resolve(`${serverName} is deleted`);
            } else {
              return reject(CreateError('server not found'));
            }
          }
          const newData = JSON.stringify(newjsonFile, null, 2);
          fs.writeFile('config.json', newData, (err) => {
            if (err) reject(err);
          });
        });
        return;
      }
      const newData = JSON.stringify({});
      fs.writeFile('config.json', newData, (err) => {
        if (err) reject(err);
      });
      fs.close(fd, (err) => {
        if (err) reject(err);
      });
      return resolve('file is initialized and is empty');
    });
  });
  return promise;
}

module.exports = { HandleFs };
