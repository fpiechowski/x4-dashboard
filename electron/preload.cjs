const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('x4Desktop', {
  isDesktop: true,
  getState: () => ipcRenderer.invoke('launcher:get-state'),
  updateRuntimeConfig: (updates) => ipcRenderer.invoke('launcher:update-runtime-config', updates),
  updateKeybindings: (updates) => ipcRenderer.invoke('launcher:update-keybindings', updates),
  testKeybinding: (action) => ipcRenderer.invoke('launcher:test-keybinding', action),
  openUrl: (url) => ipcRenderer.invoke('launcher:open-url', url),
  openPath: (targetPath) => ipcRenderer.invoke('launcher:open-path', targetPath),
  copyText: (text) => ipcRenderer.invoke('launcher:copy-text', text),
  showLogLocation: () => ipcRenderer.invoke('launcher:show-log-location'),
})
