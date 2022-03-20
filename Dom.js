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

let counting = 0;
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
    if (whoIsFirst !== "ALT_A") counting += 1;
    whoIsFirst = "ALT_A";
    let arr = document.elements.channelz.children;
    let length = document.elements.channelz.children.length;
    if (counting >= length) counting = 0;
    if (counting <= length) document.elements.inlineInput.disabled = false;
    // if (arr[counting]) document.giveFocusTo(arr[counting]);
    if (arr[counting]) arr[counting].submit()

    ++counting;
  }
  if (key === "ALT_Q" || key === 'ñ' || key === 'Ñ' || key === "ALT_SHIFT_Q") {
    term.hideCursor(true);
    if (whoIsFirst !== "ALT_Q") counting -= 1;
    whoIsFirst = "ALT_Q";
    let arr = document.elements.channelz.children;
    let length = document.elements.channelz.children.length;
    if (counting <= 0 || counting > length) counting = length;
    if (counting >= 1) document.elements.inlineInput.disabled = false;
    counting--;
    // if (arr[counting]) document.giveFocusTo(arr[counting]);
    if (arr[counting]) arr[counting].submit()

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
