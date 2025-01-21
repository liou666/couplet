import { registerIpcMain } from '@egoist/tipc/main'
import { isDev, isMacOS } from '@main/src/env'
import { router } from '@main/src/ipc/router'
import { app, BrowserWindow, screen } from 'electron'
import { initI18n } from './lib/i18n'
import tray from './tray'
import { updateManager } from './update-manager'
import { windowManager, WindowType } from './window'
async function initializeApp(): Promise<void> {
  try {
    await app.whenReady()
    await initI18n()
    registerIpcMain(router)

    const _screenWidth = screen.getPrimaryDisplay().bounds.width

    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
      process.exit(0)
    }
    else {
      app.on('second-instance', () => {
        const settingWindow = windowManager.getWindow(WindowType.SETTING)
        if (settingWindow) {
          if (settingWindow.isMinimized()) settingWindow.restore()
          settingWindow.show()
          settingWindow.focus()
        }
      })
    }

    windowManager.createWindow({
      routePath: WindowType.SETTING,
      position: { x: 500, y: 100 },
      isTransparent: false,
      resizable: true,
      width: 600,
      height: 720,
      skipTaskbar: false,
    })

    windowManager.createWindow({
      routePath: WindowType.UP_LINE,
      position: { x: 100, y: 100 },
    })

    const _lowerLine = windowManager.createWindow({
      routePath: WindowType.LOW_LINE,
      position: { x: 800, y: 100 },
    })

    windowManager.createMiddleLine()

    tray.init()

    if (!isDev)
      updateManager.checkForUpdates()

    app.on('window-all-closed', () => {
      if (isMacOS)
        app.quit()
    })

    app.on('activate', () => {
      console.log('activate')
      if (BrowserWindow.getAllWindows().length === 0) {
        windowManager.createWindow({
          routePath: WindowType.SETTING,
          position: { x: 500, y: 100 },
          isTransparent: false,
          skipTaskbar: false,
          width: 600,
          height: 720,
          // resizable: true,
        })
      }
    })

    app.on('before-quit', () => {
      console.log('before-quit')
      windowManager.closeAll()
    })
  }
  catch (error) {
    console.error('Application initialization failed:', error)
  }
}

initializeApp()
