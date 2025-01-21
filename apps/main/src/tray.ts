import path from 'path'
import {
  app,
  Menu,
  type MenuItemConstructorOptions,
  nativeImage,
  type NativeImage,
  Tray,
} from 'electron'
import { isMacOS } from './env'
import { windowManager, WindowType } from './window'

class TrayMain {
  public tray: Tray | null

  private readonly getAssetPath = (_path: string) => {
    return path.join(app.getAppPath(), 'resources', _path)
  }

  constructor() {
    this.tray = null
  }

  public async init() {
    try {
      if (isMacOS) {
        // macOS no set tray,
        // app.dock.hide()
        return
      }

      this.createTray()
      this.updateMenu()
      this.observeEvent()
    }
    catch (err) {
      console.error(err)
    }
  }

  public async updateMenu() {
    const items: MenuItemConstructorOptions[] = [
      {
        label: '设置',
        enabled: true,
        visible: true,
        click: () => {
          windowManager.getWindow(WindowType.SETTING)?.show()
        },
      },
      {
        label: '退出',
        enabled: true,
        visible: true,
        click: () => {
          app.quit()
          process.kill(0)
        },
      },
    ]

    const contextMenu = Menu.buildFromTemplate(items)
    this.tray?.setContextMenu(contextMenu)
  }

  private createTray() {
    let img: NativeImage | string = this.getAssetPath('icon.ico')
    if (isMacOS) {
    // TODO: 32x32@2x (144dpi)
      img = nativeImage.createFromPath(this.getAssetPath('iconTemplate@1x.png'))
    }

    this.tray = new Tray(img)
    this.tray.setToolTip('桌面春联')
  }

  private observeEvent() {
    if (!this.tray)
      return

    this.tray.on('click', () => {
      windowManager.getWindow(WindowType.MIDDLE_LINE)?.focus()
      windowManager.getWindow(WindowType.LOW_LINE)?.focus()
      windowManager.getWindow(WindowType.UP_LINE)?.focus()
    })
  }
}

const tray = new TrayMain()

export default tray
