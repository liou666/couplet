import { registerIpcMain } from '@egoist/tipc/main'
import { router } from '@main/src/ipc/router'
import { app, BrowserWindow, screen } from 'electron'
import { initI18n } from './lib/i18n'
import { windowManager, WindowType } from './window'

async function initializeApp(): Promise<void> {
  try {
    await app.whenReady()
    await initI18n()
    registerIpcMain(router)
    const _screenWidth = screen.getPrimaryDisplay().bounds.width

    windowManager.createWindow({
      routePath: WindowType.SETTING,
      position: { x: 500, y: 100 },
      isTransparent: false,
      resizable: true,
      width: 500,
      height: 700,
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

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin')
        app.quit()
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        windowManager.createWindow({
          routePath: WindowType.SETTING,
          position: { x: 500, y: 100 },
          isTransparent: false,
        })
      }
    })
  }
  catch (error) {
    console.error('Application initialization failed:', error)
  }
}

initializeApp()
