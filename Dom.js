const termkit = require("terminal-kit");
const Settings = require("./settings");
const term = termkit.terminal;

const fs = require('fs');
const console = require('console');
const { Console } = console;
const output = fs.createWriteStream('./outputlog.txt');
const error = fs.createWriteStream('./errlog.txt');
const logger = new Console(output, error).log

console.logger = logger

var document = term.createDocument();
term.fullscreen(true);
term.windowTitle("Frankenstein");
term.hideCursor(true);

// let Settings.buttonIndex = Settings.buttonIndex
let whoIsFirst = "";
let tabcount = 0
let charsToBeGuessed
term.on("key", function (key) {
  if(key !== 'TAB'){
    charsToBeGuessed = document.elements.Input.getContent().split(" ").slice(-1)[0]
    tabcount = 0
  }
  if(key === 'TAB'){
    let chanbutt = Settings.chanbutt
    let channelNicks
    let beforeGuessedChars = document.elements.Input.getContent().split(" ").slice(0,-1).join(" ")
    if(chanbutt && chanbutt.type !== 'Frankenstein' && Settings[chanbutt?.owner][chanbutt?.name]) {
      channelNicks = Settings[chanbutt.owner][chanbutt.name]["chanNicks"].map(nick => nick.nickname)
    }
    if(channelNicks && channelNicks.length > 0 && charsToBeGuessed){
      let guessing = channelNicks.filter(a => a.slice(0, charsToBeGuessed.length).toLowerCase() === charsToBeGuessed.toLowerCase())
      if(guessing[tabcount]){
        let before = ""
        if(beforeGuessedChars) before = beforeGuessedChars + " "
        document.elements.Input.setContent(before + guessing[tabcount])
      }
      if(tabcount < guessing.length) tabcount++
      if(tabcount >= guessing.length || tabcount < 0) tabcount = 0
    }
  }
  if (document.elements.Input.hasFocus) {
    term.hideCursor(false);
  } else {
    term.hideCursor(true);
  }
  document.giveFocusTo(document.elements.Input);
  if (key === "UP") {
    term.hideCursor(true);
    let nickss = document.elements.nicks.children[0];
    nickss.scroll(0, Math.ceil(nickss.textAreaHeight / 5));
  }
  if (key === "DOWN") {
    term.hideCursor(true);
    let nickss = document.elements.nicks.children[0];
    nickss.scroll(0, -Math.ceil(nickss.textAreaHeight / 5));
  }
  if (key === "PAGE_UP") {
    term.hideCursor(true);
    let main = document.elements.main.children.filter((e) => !e.hidden)[0];
    main.scroll(0, Math.ceil(main.textAreaHeight / 5));
  }
  if (key === "PAGE_DOWN") {
    term.hideCursor(true);
    let main = document.elements.main.children.filter((e) => !e.hidden)[0];
    main.scroll(0, -Math.ceil(main.textAreaHeight / 5));
  }

  if (key === "ALT_A" || key === 'á' || key === 'Á' || key === "ALT_SHIFT_A") {
    term.hideCursor(true);
    Settings.buttonIndex++;
    let arr = document.elements.channelz.children;
    let length = document.elements.channelz.children.length;
    if (Settings.buttonIndex >= length ) Settings.buttonIndex = 0;
    if (arr[Settings.buttonIndex]) arr[Settings.buttonIndex].submit()
  }
  if (key === "ALT_Q" || key === 'ñ' || key === 'Ñ' || key === "ALT_SHIFT_Q") {
    term.hideCursor(true);
    Settings.buttonIndex--;
    let arr = document.elements.channelz.children;
    let length = document.elements.channelz.children.length;
    if (Settings.buttonIndex <= -1 || Settings.buttonIndex > length) Settings.buttonIndex = length -1;
    if (arr[Settings.buttonIndex]) arr[Settings.buttonIndex].submit()
  }
  if (key === "CTRL_C") {
    term.grabInput(false);
    term.hideCursor(false);
    term.moveTo(1, term.height)("\n");
    term.clear();
    term.reset();
    process.exit();
  }
});

module.exports = { document, term, termkit };
