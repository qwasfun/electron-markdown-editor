const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onEditorEvent: (callback) =>
    ipcRenderer.on('editor-event', (_event, value) => callback(value)),
  saveFile: (value) => ipcRenderer.send('save', value),
  onOpenFile: (callback) =>
    ipcRenderer.on('openFile', (_event, value) => callback(value)),
});
