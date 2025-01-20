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
  upper: '蛇蛇有道迎新岁',
  lower: '财源广进贺新春',
  middle: '万事如意',
  fontSize: 60,
  backgroundColor: '#ef4444',
  fontColor: '#000',
  font: '华文行楷',
  isAlwaysOnTop: false,
  topOffset: 100,
  lineHorizontalOffset: 200,
}
