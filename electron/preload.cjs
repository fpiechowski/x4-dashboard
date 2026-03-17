const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('x4Desktop', {
  isDesktop: true,
  getState: () => ipcRenderer.invoke('launcher:get-state'),
  openUrl: (url) => ipcRenderer.invoke('launcher:open-url', url),
  copyText: (text) => ipcRenderer.invoke('launcher:copy-text', text),
  showLogLocation: () => ipcRenderer.invoke('launcher:show-log-location'),
})
