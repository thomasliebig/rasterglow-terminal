const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('retroTerminal', {
  onData: callback => ipcRenderer.on('terminal:data', (_event, data) => callback(data)),
  onExit: callback => ipcRenderer.on('terminal:exit', callback),
  input: data => ipcRenderer.send('terminal:input', data),
  resize: (cols, rows) => ipcRenderer.send('terminal:resize', { cols, rows })
});
