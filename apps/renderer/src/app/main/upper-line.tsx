import type { Setting } from '@renderer/lib/constant'
import LinePanel from '@renderer/components/line-panel'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'
import { defaultSetting } from '@renderer/lib/constant'

export default function UpperLine() {
  const [setting] = useLocalStorage<Setting>('setting', defaultSetting)

  return (
    <LinePanel
      text={setting.upper}
      font={setting.font}
      fontSize={setting.fontSize}
      backgroundColor={setting.backgroundColor}
      fontColor={setting.fontColor}
    />
  )
}
