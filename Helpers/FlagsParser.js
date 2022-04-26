function FlagsParser(arr) {
  let server;
  let port;
  let nickname;
  let user;
  let realname;
  let password;
  let serverpassword;
  let channels;
  let tls = false;
  let rejectUnauthorized = false;
  for (let i = 0; i < arr.length; i++) {
    let flag = arr[i].toLowerCase();
    if (flag === '-s' && arr[i + 1]) {
      if (!arr[i + 1].includes('/'))
        return GenerateError('invalid server -s followed by server irc.example.net/3333');
        server = arr[i + 1].split('/')[0];
        port = arr[i + 1].split('/')[1];
    }
    if (flag === '-n') {
      if (arr[i + 1] && arr[i + 1].length > 2) {
        nickname = arr[i + 1];
      } else {
        return GenerateError('invalid nickname');
      }
    }
    if (flag === '-t') {
        tls = true;
      }
    if (flag === '-a') {
      rejectUnauthorized = true;
    }
    if (flag === '-u') {
      if (arr[i + 1] && arr[i + 1].length > 2) {
        user = arr[i + 1];
      } else {
        return GenerateError('invalid user');
      }
    }
    if (flag === '-i') {
      if (arr[i + 1] && arr[i + 1].length > 2) {
        password = arr[i + 1];
      } else {
        return GenerateError('invalid password');
      }
    }
    if (flag === '-p') {
      if (arr[i + 1] && arr[i + 1].length > 2) {
        serverpassword = arr[i + 1];
      } else {
        return GenerateError('invalid server password');
      }
    }
    if (flag === '-r') {
      if (arr[i + 1] && arr[i + 1].length > 2) {
        if (arr[i + 1].includes('"')) {
          const firstIndex = i + 1; // finding 1st quote
          const findNextFlagTempvar = arr.indexOf(arr.slice(firstIndex + 1).filter((e) => e.includes('-'))[0]);
          const findNextFlag = findNextFlagTempvar !== -1 ? findNextFlagTempvar : arr.length; // finding next flag
          const secondIndex = arr.indexOf(arr.slice(firstIndex + 1, findNextFlag).filter((e) => e.includes('"'))[0]) + 1; // finding 2nd quotes
          realname = secondIndex ? arr.slice(firstIndex, secondIndex).join(' ').slice(1, -1) : arr[i + 1].slice(1, -1); // ternary if theres
        } // a second word with quote be it if not then be the 1st word with quote
      } else {
        return GenerateError('invalid realname');
      }
    }
    if (flag === '-c') {
      if (arr[i + 1] && arr[i + 1].length > 2) {
        if (arr[i + 1].includes('"')) {
          const firstIndex = i + 1; // finding 1st quote
          const findNextFlagTempvar = arr.indexOf(arr.slice(firstIndex + 1).filter((e) => e.includes('-'))[0]);
          const findNextFlag = findNextFlagTempvar !== -1 ? findNextFlagTempvar : arr.length; // finding next flag
          const secondIndex = arr.indexOf(arr.slice(firstIndex + 1, findNextFlag).filter((e) => e.includes('"'))[0]) + 1; // finding 2nd quotes
          channels = secondIndex ? arr.slice(firstIndex, secondIndex).join(' ').slice(1, -1).split(' ') : [arr[i + 1].slice(1, -1)]; // ternary if theres
        } // a second word with quote be it if not then be the 1st word with quote
      } else {
        return GenerateError('invalid channels');
      }
    }
  }
  return {
    server, port, nickname, user, realname, password, serverpassword, channels, tls, rejectUnauthorized
  };
}


function GenerateError(message){
  return new Error(message);
}

module.exports = { FlagsParser };
