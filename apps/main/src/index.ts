import 'reflect-metadata'
import path from 'path'
import { registerIpcMain } from '@egoist/tipc/main'
import { router } from '@main/src/ipc/router'
import { app, BrowserWindow, screen } from 'electron'
import { initI18n } from './lib/i18n'
import { CURRENT_DIR_PATH } from './utils'

// 窗口配置类型定义
interface WindowConfig {
  routePath: string
  position: { x: number, y: number }
  isTransparent?: boolean
  width?: number
  height?: number
}

// 窗口管理类
class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map()

  setWindowY(routePath: string, y: number): void {
    const win = this.windows.get(routePath)
    if (win) {
      const [currentX] = win.getPosition()
      win.setPosition(currentX, y)
    }
  }

  setWindowX(routePath: string, x: number): void {
    const win = this.windows.get(routePath)
    if (win) {
      const [, currentY] = win.getPosition()
      win.setPosition(x, currentY)
    }
  }

  createWindow({
    routePath,
    position,
    isTransparent = true,
    width = 501,
    height = 700,
  }: WindowConfig): BrowserWindow {
    const win = new BrowserWindow({
      width,
      height,
      frame: !isTransparent,
      transparent: isTransparent,
      useContentSize: true,
      webPreferences: {
        preload: path.join(CURRENT_DIR_PATH, '../preload/index.js'),
        webviewTag: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
      alwaysOnTop: !isTransparent,
    })

    // win.setBackgroundMaterial('none')
    win.setPosition(position.x, position.y)
    win.setMenuBarVisibility(false)

    this.loadContent(win, routePath)
    this.windows.set(routePath, win)

    return win
  }

  createMiddleLine(): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width: screenWidth } = primaryDisplay.workAreaSize
    const windowWidth = 800
    const windowHeight = 600
    const x = Math.floor((screenWidth - windowWidth) / 2)

    const win = this.createWindow({
      routePath: 'middle-line',
      position: { x, y: 0 },
      width: windowWidth,
      height: windowHeight,
    })

    // 监听窗口大小变化，保持居中
    win.on('resize', () => {
      const [width] = win.getSize()
      const newX = Math.floor((screenWidth - width) / 2)
      win.setPosition(newX, 0)
    })

    return win
  }

  private loadContent(win: BrowserWindow, routePath: string): void {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev)
      win.loadURL(`http://localhost:1234/#/${routePath}`)
    else
      win.loadFile(path.join(CURRENT_DIR_PATH, '../renderer/index.html'))

    win.webContents.openDevTools()
  }

  getWindow(routePath: string): BrowserWindow | undefined {
    return this.windows.get(routePath)
  }

  closeAll(): void {
    this.windows.forEach(window => window.close())
    this.windows.clear()
  }
}
const windowManager = new WindowManager()
export { windowManager }
// 应用初始化
async function initializeApp(): Promise<void> {
  try {
    await app.whenReady()
    await initI18n()
    registerIpcMain(router)
    const screenWidth = screen.getPrimaryDisplay().bounds.width

    // 创建设置窗口
    windowManager.createWindow({
      routePath: 'setting',
      position: { x: 500, y: 100 },
      isTransparent: false,
    })

    windowManager.createWindow({
      routePath: 'upper-line',
      position: { x: 100, y: 100 },
    })

    const lowerLine = windowManager.createWindow({
      routePath: 'lower-line',
      position: { x: 800, y: 100 },
    })
    setTimeout(() => {
      lowerLine.setPosition(screenWidth - lowerLine.getSize()?.[0] - 100, 100)
    }, 1000)

    // windowManager.createMiddleLine()

    // 当所有窗口关闭时退出应用
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin')
        app.quit()
    })

    // macOS 点击dock图标重新创建窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        windowManager.createWindow({
          routePath: 'setting',
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

// 启动应用
initializeApp()
