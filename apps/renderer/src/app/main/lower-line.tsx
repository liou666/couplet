import type { Setting } from '@renderer/lib/constant'
import LinePanel from '@renderer/components/line-panel'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'
import { client } from '@renderer/ipc/client'
import { defaultSetting } from '@renderer/lib/constant'
import { useEffect } from 'react'

export default function LowerLine() {
  const [setting] = useLocalStorage<Setting>('setting', defaultSetting)
  useEffect(() => {
    client.setLineHorizontalOffset({ offset: setting.lineHorizontalOffset })
  }, [setting])
  return (
    <LinePanel
      text={setting.lower}
      font={setting.font}
      fontSize={setting.fontSize}
      backgroundColor={setting.backgroundColor}
      fontColor={setting.fontColor}
    />
  )
}
