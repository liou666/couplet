import type { MutableRefObject } from 'react'
import { client } from '@renderer/ipc/client'
import { useCallback, useEffect } from 'react'

export default function useIgnoreMouseEvents() {
  const handleGlobalMouseover = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const isRootElement = target.nodeName === 'HTML'
    if (isRootElement)
      client.setIgnoreMouseEvents({ ignore: true, forward: true })
  }, [])

  const setIgnoreMouseEvents = useCallback(<T extends HTMLElement>(el: MutableRefObject<T>) => {
    if (!el.current) return

    const handleElementMouseover = () => {
      client.setIgnoreMouseEvents({ ignore: false })
    }

    el.current.addEventListener('mouseover', handleElementMouseover)

    document.addEventListener('mouseover', handleGlobalMouseover)

    return () => {
      el.current?.removeEventListener('mouseover', handleElementMouseover)
      document.removeEventListener('mouseover', handleGlobalMouseover)
    }
  }, [handleGlobalMouseover])

  useEffect(() => {
    return () => {
      document.removeEventListener('mouseover', handleGlobalMouseover)
    }
  }, [handleGlobalMouseover])

  return { setIgnoreMouseEvents }
}
