import LinePanel from '@renderer/components/line-panel'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'

export default function MiddleLine() {
  const [setting] = useLocalStorage('setting', {
    fontSize: 30,
    backgroundColor: '#ef4444',
    fontColor: '#000',
    font: 'Arial',
    middle: '',
  })

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
