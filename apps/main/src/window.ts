import path from 'path'
import { app, BrowserWindow, screen } from 'electron'
import { CURRENT_DIR_PATH } from './lib/utils'

const DEFAULT_WINDOW_CONFIG = {
  isTransparent: true,
  width: 1,
  height: 1,
  resizable: false,
  skipTaskbar: true,
} as const

export interface Position {
  x: number
  y: number
}

export interface WindowConfig {
  routePath: WindowType
  position: Position
  isTransparent?: boolean
  width?: number
  height?: number
  resizable?: boolean
  skipTaskbar?: boolean
}

export enum WindowType {
  SETTING = 'setting',
  MIDDLE_LINE = 'middle-line',
  UP_LINE = 'upper-line',
  LOW_LINE = 'lower-line',
}

class WindowManager {
  private readonly windows: Map<string, BrowserWindow> = new Map()
  private readonly isDev = !app.isPackaged

  private getAssetPath(...paths: string[]): string {
    const basePath = path.join(CURRENT_DIR_PATH, '..')
    return path.join(basePath, ...paths)
  }

  private updateWindowPosition(
    routePath: WindowType,
    updateFn: (win: BrowserWindow) => void,
  ): void {
    const win = this.getWindow(routePath)
    if (win)
      updateFn(win)
  }

  public setWindowY(routePath: WindowType, y: number): void {
    this.updateWindowPosition(routePath, (win) => {
      const [currentX] = win.getPosition()
      const { y: workAreaY } = screen.getPrimaryDisplay().workArea
      win.setPosition(currentX, Math.max(workAreaY, y))
    })
  }

  public setWindowX(routePath: WindowType, x: number): void {
    this.updateWindowPosition(routePath, (win) => {
      const [, currentY] = win.getPosition()
      win.setPosition(x, currentY)
    })
  }

  public createWindow(config: WindowConfig): BrowserWindow {
    const {
      routePath,
      position,
      ...rest
    } = config

    const windowConfig = {
      ...DEFAULT_WINDOW_CONFIG,
      ...rest,
    }

    const win = new BrowserWindow({
      width: windowConfig.width,
      height: windowConfig.height,
      frame: !windowConfig.isTransparent,
      skipTaskbar: windowConfig.skipTaskbar,
      transparent: windowConfig.isTransparent,
      roundedCorners: false, // for macOS
      useContentSize: true,
      enableLargerThanScreen: true,
      resizable: windowConfig.resizable,
      webPreferences: {
        preload: this.getAssetPath('preload', 'index.js'),
        webviewTag: true,
        contextIsolation: true,
        nodeIntegration: false,
      },
      alwaysOnTop: false,
    })

    try {
      this.setupWindow(win, position)
      this.loadContent(win, routePath)
      this.windows.set(routePath, win)

      if (routePath === WindowType.SETTING) {
        // @ts-expect-error
        win.on('close', (event: Event) => {
          event.preventDefault()
          win.hide()
        })
      }
      else {
        win.on('closed', () => {
          this.windows.delete(routePath)
        })
      }
      return win
    }
    catch (error) {
      console.error('Error creating window:', error)
      throw error
    }
  }

  public createMiddleLine(): BrowserWindow {
    const display = screen.getPrimaryDisplay()
    const { width: screenWidth, height: _screenHeight } = display.workAreaSize
    const x = Math.floor(screenWidth / 2)

    const win = this.createWindow({
      routePath: WindowType.MIDDLE_LINE,
      position: { x, y: display.workArea.y },
    })

    this.setupMiddleLineResizeHandler(win, screenWidth)

    return win
  }

  public getWindow(routePath: string): BrowserWindow | undefined {
    return this.windows.get(routePath)
  }

  public closeAll(): void {
    this.windows.forEach(window => window.close())
    this.windows.clear()
  }

  private setupWindow(
    win: BrowserWindow,
    position: Position,
  ): void {
    win.setPosition(position.x, position.y)
    win.setMenuBarVisibility(false)

    if (!DEFAULT_WINDOW_CONFIG.resizable)
      win.on('will-resize', event => event.preventDefault())
  }

  private setupMiddleLineResizeHandler(
    win: BrowserWindow,
    screenWidth: number,
  ): void {
    win.on('resize', () => {
      const [width] = win.getSize()
      const newX = Math.floor((screenWidth - width) / 2)
      const [, currentY] = win.getPosition()
      win.setPosition(newX, currentY)
    })
  }

  private async loadContent(win: BrowserWindow, routePath: string): Promise<void> {
    try {
      if (this.isDev) {
        await win.loadURL(`http://localhost:1234/#/${routePath}`)
      }
      else {
        const indexPath = this.getAssetPath('renderer', 'index.html')
        await win.loadFile(indexPath, { hash: routePath })
      }

      // if (this.isDev)
      //   win.webContents.openDevTools()
    }
    catch (error) {
      console.error('Error loading content:', error)
      throw error
    }
  }
}

export const windowManager = new WindowManager()
