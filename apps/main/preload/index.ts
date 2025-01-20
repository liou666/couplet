import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: ipcRenderer.invoke.bind(ipcRenderer),
  on: ipcRenderer.on.bind(ipcRenderer),
  send: ipcRenderer.send.bind(ipcRenderer),
  off: ipcRenderer.off.bind(ipcRenderer),
})

declare global {
  interface Window {
    ipcRenderer: {
      invoke: Electron.IpcRenderer['invoke']
      on: Electron.IpcRenderer['on']
      send: Electron.IpcRenderer['send']
      off: Electron.IpcRenderer['off']
    }
  }
}
