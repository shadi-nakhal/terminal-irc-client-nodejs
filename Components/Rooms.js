const { document, termkit, term } = require('../Dom');
const Settings = require('../settings');

class Rooms {
  constructor() {
    this.hidden = false;
    this.count = 0;
    this.Layout = new termkit.Layout({
      parent: document,
      boxChars: 'ascii',
      id: 'layout',
      layout: {
        y: 0,
        widthPercent: 100,
        heightPercent: 100,
        rows: [
          {
            id: '1st-row',
            heightPercent: 93,
            columns: [
              { id: 'channels', widthPercent: 16, height: 250 },
              { id: 'main', widthPercent: 70 },
              { id: 'nicks', widthPercent: 16 }
            ]
          },
          {
            id: '2nd-row',
            columns: [{ id: 'inlineInput', widthPercent: 100, height: 2 }]
          }
        ]
      }
    });

    this.channelz = new termkit.ColumnMenu({
      parent: document.elements.channels,
      autoWidth: true,
      autoHeight: true,
      blurLeftPadding: '  ',
      lineWrap: false,
      wordWrap: false,
      focusLeftPadding: '^R> ',
      disabledLeftPadding: '',
      paddingHasMarkup: true,
      id: 'channelz',
      items: [
        {
          content: '^yFrankenstein^',
          value: {
            name: 'Frankenstein', id: 'Frankenstein_Frankenstein', type: 'Frankenstein', owner: 'Frankenstein'
          },
          focusAttr: { bgColor: '@light-gray', bold: true },
          contentHasMarkup: true,
          blurAttr: { bgColor: '@light-gray', bold: false },
          id: 'Frankenstein_Frankenstein'
        }
      ]
    });

    this.channelz.on('submit', this.Submittion);

    this.Nicks = new termkit.TextBox({
      parent: document.elements.nicks,
      content: '',
      contentHasMarkup: true,
      scrollable: true,
      lineWrap: false,
      wordWrap: false,
      autoWidth: true,
      autoHeight: true,
      vScrollBar: false,
      id: 'nicks'
    });

    this.Main = new termkit.TextBox({
      parent: document.elements.main,
      content: '',
      contentHasMarkup: true,
      scrollable: true,
      lineWrap: true,
      wordWrap: true,
      autoWidth: true,
      autoHeight: true,
      vScrollBar: false,
      id: 'channel_main'
    });

    this.Status = new termkit.TextBox({
      parent: document.elements.main,
      content: '',
      contentHasMarkup: true,
      scrollable: true,
      lineWrap: true,
      wordWrap: true,
      autoHeight: true,
      autoWidth: true,
      vScrollBar: false,
      id: 'status'
    });

    this.input = new termkit.InlineInput({
      parent: document.elements.inlineInput,
      placeholder: 'Your text here',
      id: 'Input',
      prompt: {
        contentHasMarkup: true,
        lineWrap: false
      },
      width: 200,
      cancelable: true,
      value: ''
    });
  }

  ShowStatus = () => {
    this.Layout.layoutDef.rows[0].columns = [
      { id: 'channels', widthPercent: 16 },
      { id: 'main', widthPercent: 100 }
    ];
    this.Layout.computeBoundingBoxes();
    this.Nicks.hide();
    this.Layout.redraw();
    this.Status.redraw();
    this.Status.show();
    this.Main.hide();
    this.hidden = true;
    term.styleReset();
  };

  ShowRoom = () => {
    this.Layout.layoutDef.rows[0].columns = [
      { id: 'channels', widthPercent: 16 },
      { id: 'main', widthPercent: 70 },
      { id: 'nicks', widthPercent: 16 }
    ];
    this.Layout.computeBoundingBoxes();
    this.Layout.redraw();
    this.Nicks.redraw();
    this.Main.redraw();
    this.Main.show();
    this.Nicks.show();
    this.Status.hide();
    this.hidden = false;
    term.styleReset();
  };

  changePrompt = (text) => {
    const newprompt = `${text}: `;
    this.input.promptTextBox.setContent(`^C${newprompt}^:`, true);
    const size = this.input.promptTextBox.getContentSize();
    this.input.promptTextBox.setSizeAndPosition({ width: newprompt.length, height: size.height });
    this.input.setSizeAndPosition({ x: newprompt.length - this.input.firstLineRightShift });
    this.input.promptTextBox.draw(true);
    this.input.autoResizeAndDraw(true);
  };

  GenerateChannels = (channel) => {
    const conf = {
      parent: document.elements.channels,
      content: '^R>ERROR',
      value: channel,
      focusAttr: { bgColor: '@light-gray', bold: true },
      contentHasMarkup: true,
      blurAttr: { bgColor: '@light-gray', bold: false },
      x: 0,
      key: `${channel.owner}_${channel.name}`,
      id: `${channel.owner}_${channel.name}`
    };
    if (channel.type) {
      if (channel.type === 'server') {
        conf.content = `^B${channel.name}`;
        this.channelz.itemsDef.push(conf);
        this.channelz.onParentResize();
        setTimeout(() => {
          this.channelz.children.find((chan) => chan.key === conf.id).submit();
        }, 0.1);
      }
      if (channel.type === 'channel' || channel.type === 'private') {
        conf.content = channel.name;
        const chanServer = this.channelz.itemsDef.filter(
          (e) => e.value?.type === 'server' && e.value?.owner === channel.owner
        )[0];
        const serverChannelsNumber = this.channelz.itemsDef.filter(
          (e) => e.value?.type === 'channel' && e.value?.owner === channel.owner
        ).length;
        const indexOfServer = this.channelz.itemsDef.indexOf(chanServer);
        if (chanServer) {
          this.channelz.itemsDef.splice(indexOfServer + 1 + serverChannelsNumber, 0, conf);
          this.channelz.onParentResize();
        }
        if (channel.type === 'channel') {
          setTimeout(() => {
            this.channelz.children.find((chan) => chan.key === conf.id).submit();
          }, 0.1);
        }
      }
    }
  };

  Submittion = (value) => {
    const clickedChannel = this.channelz.itemsDef.find((e) => e.id === `${value.owner}_${value.name}`);
    const loadedChannel = this.channelz.itemsDef.find((e) => e.id === `${value.owner}_${value.name}`);
    const restOfChannels = this.channelz.itemsDef.filter((e) => e.id !== `${value.owner}_${value.name}`);
    if (clickedChannel) clickedChannel.content = `^G>${value.name.replaceAll('^', '^^')}^`;
    restOfChannels.map((e) => {
      if (e.value.type === 'server') e.content = `^B${e.value.name}^`;
      if (e.value.type === 'Frankenstein') e.content = `^y${e.value.name}^`;
      if (e.value.type === 'channel' && Settings[e.value.owner][e.value.name].viewed) e.content = e.value.name;
      if (e.value.type === 'private' && Settings[e.value.owner].private[e.value.name].viewed) e.content = e.value.name.replaceAll('^', '^^');
    });
    this.channelz.onParentResize();
    Settings.buttonIndex = this.channelz.itemsDef.indexOf(loadedChannel);
  };

  DestroyChannel = (leftchanID) => {
    const newlist = this.channelz.itemsDef.filter((e) => e.id !== leftchanID);
    this.channelz.itemsDef = newlist;
    this.channelz.onParentResize();
    this.channelz.redraw();
  };
}

module.exports = { Rooms };
