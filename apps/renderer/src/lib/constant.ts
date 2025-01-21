export interface Setting {
  upper: string
  lower: string
  fontSize: number
  backgroundColor: string
  fontColor: string
  font: string
  middle: string
  isAlwaysOnTop: boolean
  topOffset: number
  lineHorizontalOffset: number
}

export const defaultSetting: Setting = {
  upper: '屏幕春联传雅意',
  lower: '指尖科技绽春花 ',
  middle: '春满人间',
  fontSize: 60,
  backgroundColor: '#ef4444',
  fontColor: '#000',
  font: '华文行楷',
  isAlwaysOnTop: false,
  topOffset: 100,
  lineHorizontalOffset: 200,
}
