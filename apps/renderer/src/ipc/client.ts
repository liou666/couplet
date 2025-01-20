import type { Router } from '@main/src/ipc/router'
import { createClient, createEventHandlers } from '@egoist/tipc/renderer'

export const client = createClient<Router>({
  ipcInvoke: window.ipcRenderer.invoke,
})

export const handler = createEventHandlers({
  on: (channel, callback) => {
    window.ipcRenderer.on(channel, callback)
    return () => {
      window.ipcRenderer.off(channel, callback)
    }
  },
  send: window.ipcRenderer.send,
})
