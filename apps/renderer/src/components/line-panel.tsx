import type { MutableRefObject } from 'react'
import useIgnoreMouseEvents from '@renderer/hooks/useIgnoreMouseEvent'
import useResizeObserver from '@renderer/hooks/useResizeObserver'
import { client } from '@renderer/ipc/client'
import clsx from 'clsx'
import { debounce } from 'lodash-es'
import { useEffect } from 'react'
export default function LinePanel({
  text,
  fontSize,
  backgroundColor,
  fontColor,
  font,
  className,
  direction = 'column',
}: {
  text: string
  fontSize: number
  backgroundColor: string
  fontColor: string
  font: string
  className?: string
  direction?: 'row' | 'column'
}) {
  const [ref, dimensions] = useResizeObserver<HTMLDivElement>()
  const { setIgnoreMouseEvents } = useIgnoreMouseEvents()
  useEffect(() => {
    const updateWindowSize = debounce(() => {
      if (dimensions.width > 0 && dimensions.height > 0) {
        requestAnimationFrame(() => {
          client.setWindowSize({
            width: dimensions.width,
            height: dimensions.height,
          })
        })
      }
    }, 5)

    updateWindowSize()
    return () => {
      updateWindowSize.cancel()
    }
  }, [dimensions.width, dimensions.height])

  useEffect(() => {
    if (ref.current) {
      const cleanup = setIgnoreMouseEvents(ref as MutableRefObject<HTMLDivElement>)
      return cleanup
    }
  }, [setIgnoreMouseEvents])

  return (
    <div
      ref={ref}
      style={{
        fontSize: `${fontSize}px`,
        width: 'max-content',
        height: 'max-content',
        backgroundColor,
        color: fontColor,
        fontFamily: font,
      }}

      className={
        clsx(
          'flex  font-[700] justify-center items-center gap-4  hidden-scrollbar',
          direction === 'row' ? 'flex-row  py-1 px-6 align-middle' : 'flex-col py-4 px-3',
          className,
        )
      }
    >
      {
        text.split('').map((item, index) => (
          <div className="w-[max-content] h-[max-content] flex items-center justify-center" key={index}>{item}</div>
        ))
      }
    </div>
  )
}
