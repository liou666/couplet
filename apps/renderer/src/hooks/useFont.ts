import { client } from '@renderer/ipc/client'
import { useCallback, useEffect, useState } from 'react'

const useFont = () => {
  const [fonts, setFonts] = useState<string[]>([])

  const refreshFonts = useCallback(async () => {
    try {
      const newFonts = await client.getSystemFonts()
      setFonts(newFonts)
    }
    catch (err) {
      console.log('[getSystemFonts error]: ', err)
    }
  }, [])

  useEffect(() => {
    refreshFonts()
  }, [refreshFonts])

  return {
    fonts,
    refreshFonts,
  }
}

export default useFont
