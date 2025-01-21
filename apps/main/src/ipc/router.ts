import { tipc } from '@egoist/tipc/main'
import { BrowserWindow, screen } from 'electron'
import { windowManager, WindowType } from '../window'

const t = tipc.create()

export const router = {
  windowAction: t.procedure
    .input<{ action: 'maximize' | 'minimize' | 'close' }>()
    .action(async ({ input, context }) => {
      if (context.sender.getType() === 'window') {
        const window: BrowserWindow | null = (context.sender as Sender).getOwnerBrowserWindow()
        if (!window) return
        switch (input.action) {
          case 'close': {
            window.close()
            break
          }
          case 'minimize': {
            window.minimize()
            break
          }
          case 'maximize': {
            if (window.isMaximized())
              window.unmaximize()
            else
              window.maximize()
            break
          }
        }
      }
    }),
  isMaximized: t.procedure
    .action(async ({ context }) => {
      if (context.sender.getType() === 'window') {
        const window: BrowserWindow | null = (context.sender as Sender).getOwnerBrowserWindow()
        if (!window) return
        return window.isMaximized()
      }
      return false
    }),
  setWindowBounds: t.procedure
    .input<{ x: number, y: number, width: number, height: number }>()
    .action(async ({ input, context }) => {
      if (context.sender.getType() === 'window') {
        const window: BrowserWindow | null = (context.sender as Sender).getOwnerBrowserWindow()
        if (!window) return
        window.setBounds({ x: input.x, y: input.y, width: input.width, height: input.height })
      }
    }),
  setWindowSize: t.procedure
    .input<{ width: number, height: number }>()
    .action(async ({ input, context }) => {
      if (context.sender.getType() === 'window') {
        const window: BrowserWindow | null = (context.sender as Sender).getOwnerBrowserWindow()
        if (!window) return
        window.setSize(Math.floor(input.width), Math.floor(input.height))
      }
    }),
  setWindowPosition: t.procedure
    .input<{ x: number, y: number }>()
    .action(async ({ input, context }) => {
      if (context.sender.getType() === 'window') {
        const window: BrowserWindow | null = (context.sender as Sender).getOwnerBrowserWindow()
        if (!window) return
        window.setPosition(input.x, input.y)
      }
    }),
  getSystemFonts: t.procedure.action(
    async (): Promise<string[]> =>
      new Promise((resolve) => {
        require('font-list')
          .getFonts()
          .then((fonts: string[]) => {
            resolve(fonts.map(font => font.replaceAll('"', '')))
          }).catch((err: any) => {
            console.log('[getSystemFonts error]: ', err)
            resolve([])
          })
      }),
  ),
  setAlwaysOnTop: t.procedure
    .input<{ isAlwaysOnTop: boolean }>()
    .action(async ({ input }) => {
      const window = BrowserWindow.getAllWindows()
      window.forEach((w) => {
        w.setAlwaysOnTop(input.isAlwaysOnTop)
      })
    }),
  setLineTop: t.procedure
    .input<{ top: number }>()
    .action(async ({ input }) => {
      windowManager.setWindowY(WindowType.UP_LINE, input.top)
      windowManager.setWindowY(WindowType.LOW_LINE, input.top)
    }),

  setLineHorizontalOffset: t.procedure
    .input<{ offset: number }>()
    .action(async ({ input }) => {
      windowManager.setWindowX(WindowType.UP_LINE, input.offset)
      const width = windowManager.getWindow(WindowType.UP_LINE)?.getSize()?.[0] || 0
      const screenWidth = screen.getPrimaryDisplay().bounds.width
      windowManager.setWindowX(WindowType.LOW_LINE, screenWidth - input.offset - width)
    }),

  getLineHorizontalOffset: t.procedure
    .action(async (): Promise<[number, number]> => {
      return [0, 0]
    }),

  setResizable: t.procedure
    .input<{ resizable: boolean }>()
    .action(async ({ input }) => {
      const window = BrowserWindow.getAllWindows()
      window.forEach((w) => {
        w.setResizable(input.resizable)
      })
    }),

  setIgnoreMouseEvents: t.procedure
    .input<{ ignore: boolean, forward?: boolean }>()
    .action(async ({ input }) => {
      const window = BrowserWindow.getAllWindows()
      window.forEach((w) => {
        w.setIgnoreMouseEvents(input.ignore, { forward: !!input.forward })
      })
    }),

}

interface Sender extends Electron.WebContents {
  getOwnerBrowserWindow: () => Electron.BrowserWindow | null
}

export type Router = typeof router
