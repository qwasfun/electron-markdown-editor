const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const menu = require('./menu');

let mainWindow;
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  ipcMain.on('save', (event, arg) => {
    console.log('save content of the file', arg);
    const options = {
      title: 'Save markdown file',
      filters: [
        {
          name: 'markdown',
          extensions: ['md'],
        },
      ],
    };
    dialog.showSaveDialog(mainWindow, options).then((res) => {
      console.log('showSaveDialog', res);
      if (!res.canceled) {
        fs.writeFileSync(res.filePath, arg);
      }
    });
    console.log(arg);
  });

  if (process.env.DEBUG) {
    mainWindow.webContents.openDevTools();
  }
});

Menu.setApplicationMenu(menu);
