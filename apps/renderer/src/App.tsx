import useResizeObserver from '@renderer/hooks/useResizeObserver'
import { client } from '@renderer/ipc/client'
import { debounce } from 'lodash-es'
import { useEffect, useState } from 'react'

export default function App() {
  const [font, _setFont] = useState<string>(' 一二三四五六七')

  const [fontSize, setFontSize] = useState<number>(30)

  const [ref, dimensions] = useResizeObserver<HTMLDivElement>()
  // client.setWindowSize({ width: 200, height: 700 })

  useEffect(() => {
    const updateWindowSize = debounce(() => {
      // 确保尺寸有效
      if (dimensions.width > 0 && dimensions.height > 0) {
        requestAnimationFrame(() => {
          client.setWindowSize({
            width: dimensions.width,
            height: dimensions.height,
          })
        })
      }
    }, 100) // 100ms 的延迟

    updateWindowSize()

    return () => {
      updateWindowSize.cancel()
    }
  }, [dimensions.width, dimensions.height])
  return (
    <div
      ref={ref}
      // style={{
      //   width: dimensions.width,
      //   height: dimensions.height,
      // }}
      style={{
        fontSize: `${fontSize}px`,
        width: 'max-content',
        height: 'max-content',
      }}
      className="flex flex-col text-5xl font-[700] justify-center items-center gap-4 bg-purple-300 py-4 px-3 hidden-scrollbar"
    >
      {/* {dimensions.width}
      <br />
      {dimensions.height}
      <br /> */}
      {
        font.split('').map((item, index) => (
          <div className="w-full h-full text-center" key={index}>{item}</div>
        ))
      }
      <input
        type="number" value={fontSize}
        className="w-10 bg-red-500"
        onChange={e => setFontSize(Number(e.target.value))}
      />
    </div>
  )
}
