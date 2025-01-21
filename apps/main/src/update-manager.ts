import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

class UpdateManager {
  private constructor() {
    this.init()
  }

  private static instance: UpdateManager

  public static getInstance(): UpdateManager {
    if (!UpdateManager.instance)
      UpdateManager.instance = new UpdateManager()

    return UpdateManager.instance
  }

  private init(): void {
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true

    autoUpdater.on('error', (error) => {
      dialog.showErrorBox('更新出错', error.message)
    })

    // autoUpdater.on('checking-for-update', () => {
    //   this.sendStatusToWindow('正在检查更新...')
    // })

    autoUpdater.on('update-available', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: '应用更新',
        message: `发现新版本 ${info.version}，是否现在更新？`,
        buttons: ['现在更新', '稍后更新'],
        cancelId: 1,
      }).then((result) => {
        if (result.response === 0)
          autoUpdater.downloadUpdate()
      }).catch((error) => {
        console.error(error)
      })
    })

    // autoUpdater.on('update-not-available', () => {
    //   this.sendStatusToWindow('当前已是最新版本')
    // })

    // autoUpdater.on('download-progress', (progressObj) => {
    //   this.sendStatusToWindow(
    //     `下载速度: ${progressObj.bytesPerSecond} - `
    //     + `已下载 ${progressObj.percent}% `
    //     + `(${progressObj.transferred}/${progressObj.total})`,
    //   )
    // })

    // 更新下载完成
    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        title: '安装更新',
        message: '更新下载完成，应用将重启并进行安装',
      }).then(() => {
        setImmediate(() => autoUpdater.quitAndInstall())
      }).catch((error) => {
        console.error(error)
      })
    })
  }

  // private sendStatusToWindow(text: string): void {
  //   const win = windowManager.getWindow(WindowType.SETTING)
  //   if (win)
  //     win.webContents.send('update-message', text)
  // }

  public checkForUpdates(): void {
    autoUpdater.checkForUpdates()
  }

  public downloadUpdate(): void {
    autoUpdater.downloadUpdate()
  }
}

export const updateManager = UpdateManager.getInstance()
