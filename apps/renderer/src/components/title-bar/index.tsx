import { client } from '@renderer/ipc/client'
import React, { useEffect, useState } from 'react'
export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  const updateIsMaximized = async () => {
    const maximized = await client.isMaximized()
    setIsMaximized(!!maximized)
  }
  useEffect(() => {
    updateIsMaximized()
  }, [])

  return (
    <header className="border-b h-full drag-region flex items-center overflow-hidden">
      <button className="mr-auto ml-2 w-6 h-full flex items-center justify-center">
        <i className="i-mingcute-alarm-1-line w-full h-full" />
      </button>
      <button
        className="no-drag-region pointer-events-auto flex h-full w-[50px] items-center justify-center duration-200 hover:bg-accent"
        type="button"
        onClick={() => {
          client.windowAction({ action: 'minimize' })
        }}
      >
        <i className="i-mingcute-minimize-line" />
      </button>
      <button
        type="button"
        className="no-drag-region pointer-events-auto flex h-full w-[50px] items-center justify-center duration-200 hover:bg-accent"
        onClick={async () => {
          await client.windowAction({ action: 'maximize' })
          updateIsMaximized()
        }}
      >
        {
          isMaximized ? <i className="i-mingcute-restore-line" /> : <i className="i-mingcute-square-line" />
        }

      </button>
      <button
        type="button"
        className="no-drag-region pointer-events-auto flex h-full w-[50px] items-center justify-center duration-200 hover:bg-destructive hover:!text-white"
        onClick={() => {
          client.windowAction({ action: 'close' })
        }}
      >
        <i className="i-mingcute-close-line" />
      </button>
    </header>
  )
}
