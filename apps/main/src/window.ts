import path from 'path'
import { BrowserWindow, screen } from 'electron'
import { CURRENT_DIR_PATH } from './utils'

export interface WindowConfig {
  routePath: string
  position: { x: number, y: number }
  isTransparent?: boolean
  width?: number
  height?: number
  resizable?: boolean
}

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
    width = 1,
    height = 1,
    resizable = false,
  }: WindowConfig): BrowserWindow {
    const win = new BrowserWindow({
      width,
      height,
      frame: !isTransparent,
      transparent: isTransparent,
      useContentSize: true,
      enableLargerThanScreen: true, // 允许窗口比屏幕大
      resizable: true,
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

    if (!resizable) {
      win.on('will-resize', (event) => {
        event.preventDefault()
      })
    }
    this.loadContent(win, routePath)
    this.windows.set(routePath, win)

    return win
  }

  createMiddleLine(): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width: screenWidth } = primaryDisplay.workAreaSize
    const windowWidth = 800
    const _windowHeight = 600
    const x = Math.floor((screenWidth - windowWidth) / 2)

    const win = this.createWindow({
      routePath: 'middle-line',
      position: { x, y: 0 },
      // width: windowWidth,
      // height: windowHeight,
    })

    win.on('resize', () => {
      const [width] = win.getSize()
      const newX = Math.floor((screenWidth - width) / 2)
      win.setPosition(newX, 0)
    })

    return win
  }

  private loadContent(win: BrowserWindow, routePath: string): void {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
      win.loadURL(`http://localhost:1234/#/${routePath}`)
      win.webContents.openDevTools()
    }
    else { win.loadFile(path.join(CURRENT_DIR_PATH, `../renderer/index.html/#/${routePath}`)) }
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
