import LinePanel from '@renderer/components/line-panel'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'
import { client } from '@renderer/ipc/client'
import { useEffect } from 'react'

export default function LowerLine() {
  const [setting] = useLocalStorage('setting', {
    upper: '',
    lower: '',
    fontSize: 30,
    backgroundColor: '#ef4444',
    fontColor: '#000',
    font: 'Arial',
    lineHorizontalOffset: 100,
  })
  console.log(setting.lower)
  useEffect(() => {
    client.setLineHorizontalOffset({ offset: setting.lineHorizontalOffset })
  }, [])
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
