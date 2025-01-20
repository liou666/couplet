import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

// Type for dimensions
interface Dimensions {
  width: number
  height: number
  top: number
  left: number
}

// Hook for observing element resize
const useResizeObserver = <T extends HTMLElement>(
  callback?: (dimensions: Dimensions) => void,
  debounceTime: number = 100,
): [MutableRefObject<T | null>, Dimensions] => {
  const ref = useRef<T | null>(null)
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  })

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      const { width, height, top, left } = ref.current.getBoundingClientRect()
      const newDimensions = { width, height, top, left }
      setDimensions(newDimensions)
      if (callback)
        callback(newDimensions)
    }
  }, [callback])

  useEffect(() => {
    if (!('ResizeObserver' in window)) {
      console.warn('ResizeObserver is not supported by your browser.')
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      if (debounceTime > 0) {
        clearTimeout((resizeObserver as any).debounceTimeout);
        (resizeObserver as any).debounceTimeout = setTimeout(updateDimensions, debounceTime)
      }
      else {
        updateDimensions()
      }
    })

    if (ref.current) {
      resizeObserver.observe(ref.current)
      updateDimensions()
    }

    return () => {
      if (ref.current)
        resizeObserver.unobserve(ref.current)

      resizeObserver.disconnect()
    }
  }, [updateDimensions, debounceTime])

  return [ref, dimensions]
}

export default useResizeObserver
