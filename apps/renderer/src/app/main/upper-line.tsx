import LinePanel from '@renderer/components/line-panel'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'

export default function UpperLine() {
  const [setting] = useLocalStorage('setting', {
    upper: '',
    fontSize: 30,
    backgroundColor: '#ef4444',
    fontColor: '#000',
    font: 'Arial',
  })

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
