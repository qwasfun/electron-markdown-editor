const {
  app,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  globalShortcut,
  dialog,
} = require('electron');
const fs = require('node:fs');

// app.whenReady().then(() => {
//   globalShortcut.register("CommandOrControl+S",()=>{
//     console.log('Saving the file');
//     const currentWindow = BrowserWindow.getFocusedWindow();
//     currentWindow.webContents.send('editor-event', 'save');
//   })
// });

function saveFile() {
  const currentWindow = BrowserWindow.getFocusedWindow();
  const options = {
    title: '打开一个markdown文件',
    filters: [
      { name: 'Markdown files', extensions: ['md'] },
      { name: 'Text files', extensions: ['txt'] },
    ],
  };
  dialog.showOpenDialog(currentWindow, options).then((res) => {
    console.log('showOpenDialog', res);
    if (!res.canceled) {
      const content = fs.readFileSync(res.filePaths[0]).toString();
      // window.webContents
      currentWindow.webContents.send('openFile', content);
    }
  });
}

const template = [
  {
    label: '文件',
    submenu: [
      {
        label: '打开文件',
        accelerator: 'Ctrl+O',
        click() {
          saveFile();
        },
      },
      {
        label: '保存',
        accelerator: 'Ctrl+S',
        click() {
          const currentWindow = BrowserWindow.getFocusedWindow();
          currentWindow.webContents.send('editor-event', 'save');
        },
      },
    ],
  },
  {
    label: '格式化',
    submenu: [
      {
        label: '粗体',
        accelerator: 'Ctrl+B',
        click() {
          const currentWindow = BrowserWindow.getFocusedWindow();
          currentWindow.webContents.send('editor-event', 'toggle-bold');
        },
      },
      {
        label: '斜体',
        accelerator: 'Ctrl+I',
        click() {
          const currentWindow = BrowserWindow.getFocusedWindow();
          currentWindow.webContents.send('editor-event', 'toggle-italic');
        },
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About Editor',
        click() {
          shell.openExternal('https://simplemde.com');
        },
      },
    ],
  },
];

ipcMain.on('editor-reply', (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
});

if (process.env.DEBUG) {
  template.push({
    label: 'Debugging',
    submenu: [
      {
        label: 'Dev Tools',
        role: 'toggleDevTools',
      },
      {
        type: 'separator',
      },
      {
        role: 'reload',
        accelerator: 'Ctrl+R',
      },
    ],
  });
}

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
      },
    ],
  });
}

const menu = Menu.buildFromTemplate(template);
module.exports = menu;
