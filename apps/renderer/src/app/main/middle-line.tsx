import type { Setting } from '@renderer/lib/constant'
import LinePanel from '@renderer/components/line-panel'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'
import { defaultSetting } from '@renderer/lib/constant'

export default function MiddleLine() {
  const [setting] = useLocalStorage<Setting>('setting', defaultSetting)
  console.log('MiddleLine', setting)
  return (
    <LinePanel
      direction="row"
      text={setting.middle}
      fontSize={setting.fontSize}
      backgroundColor={setting.backgroundColor}
      fontColor={setting.fontColor}
      font={setting.font}
    />
  )
}
