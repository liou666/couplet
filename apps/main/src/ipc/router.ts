import { tipc } from '@egoist/tipc/main'
import { BrowserWindow, screen } from 'electron'
import { windowManager } from '../index'
import { store } from '../lib/store'
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
        console.log(input)
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
  setStore: t.procedure
    .input<{ key: string, value: any }>()
    .action(async ({ input }) => {
      store.set(input.key, input.value)
    }),
  getStore: t.procedure
    .input<{ key: string }>()
    .action(async ({ input }) => {
      return store.get(input.key)
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
      windowManager.setWindowY('upper-line', input.top)
      windowManager.setWindowY('lower-line', input.top)
    }),

  setLineHorizontalOffset: t.procedure
    .input<{ offset: number }>()
    .action(async ({ input }) => {
      windowManager.setWindowX('upper-line', input.offset)
      const width = windowManager.getWindow('upper-line')?.getSize()?.[0] || 0
      const screenWidth = screen.getPrimaryDisplay().bounds.width
      windowManager.setWindowX('lower-line', screenWidth - input.offset - width)
    }),

  getLineHorizontalOffset: t.procedure
    .action(async (): Promise<[number, number]> => {
      return [0, 0]
    }),
}

interface Sender extends Electron.WebContents {
  getOwnerBrowserWindow: () => Electron.BrowserWindow | null
}

export type Router = typeof router
