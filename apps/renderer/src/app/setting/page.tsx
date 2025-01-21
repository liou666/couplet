import type { Setting } from '@renderer/lib/constant'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@renderer/components/ui/select'
import { Switch } from '@renderer/components/ui/switch'
import useFont from '@renderer/hooks/useFont'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'

import { client } from '@renderer/ipc/client'
import { defaultSetting } from '@renderer/lib/constant'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const LabeledInput = React.memo(({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="flex items-center justify-between rounded-md">
      <span className="w-[80px] text-sm">{label}</span>
      <Input
        className="h-[36px] w-[300px] text-sm" value={value}
        onChange={handleChange} type={type}
      />
    </div>
  )
})

const ColorPicker = React.memo(({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) => {
  const [localColor, setLocalColor] = useState(value)
  // @ts-expect-error
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setLocalColor(newColor)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      onChange(newColor)
    }, 5)
  }, [onChange])

  useEffect(() => {
    setLocalColor(value)
  }, [value])

  return (
    <div className="flex items-center justify-between rounded-md">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-500">{localColor}</div>
        <Input
          type="color"
          value={localColor}
          onChange={handleColorChange}
          className="w-[60px] h-[40px] p-1"
        />
      </div>
    </div>
  )
})

const FontSelector = React.memo(({
  value,
  fonts,
  onValueChange,
}: {
  value: string
  fonts: string[]
  onValueChange: (value: string) => void
}) => {
  const fontItems = useMemo(() => fonts.map(font => (
    <SelectItem key={font} value={font}>{font}</SelectItem>
  )), [fonts])

  return (
    <div className="flex items-center justify-between rounded-md">
      <span className="text-sm">字体样式</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="选择字体" />
        </SelectTrigger>
        <SelectContent>
          {fontItems}
        </SelectContent>
      </Select>
    </div>
  )
})

const LabeledNumberInput = React.memo(({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }, [onChange])

  return (
    <div className="flex items-center justify-between rounded-md">
      <span className="w-[120px] text-sm">{label}</span>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-[300px]"
      />
    </div>
  )
})

export default function Page() {
  const { fonts } = useFont()
  const [settings, setSettings] = useLocalStorage<Setting>('setting', defaultSetting)
  const ref = useRef<HTMLDivElement>(null)

  const [isLoaded, setIsLoaded] = useState(false)

  const updateSetting = useCallback(<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [setSettings])

  const handleAlwaysOnTopChange = useCallback((value: boolean) => {
    client.setAlwaysOnTop({ isAlwaysOnTop: value })
    updateSetting('isAlwaysOnTop', value)
  }, [updateSetting])

  const handleLineTopChange = useCallback((value: number) => {
    client.setLineTop({ top: value })
    updateSetting('topOffset', value)
  }, [updateSetting])

  const handleLineHorizontalOffsetChange = useCallback((value: number) => {
    client.setLineHorizontalOffset({ offset: value })
    updateSetting('lineHorizontalOffset', value)
  }, [updateSetting])

  const handleFontSizeChange = useCallback((value: number) => {
    updateSetting('fontSize', value)
    client.setLineHorizontalOffset({ offset: settings.lineHorizontalOffset })
  }, [updateSetting])

  const resetAllSettings = useCallback(() => {
    setSettings(defaultSetting)
    client.setAlwaysOnTop({ isAlwaysOnTop: false })
    client.setLineHorizontalOffset({ offset: 200 })
    client.setLineTop({ top: 100 })
  }, [setSettings])

  useEffect(() => {
    client.setLineHorizontalOffset({ offset: settings.lineHorizontalOffset })
    client.setLineTop({ top: settings.topOffset })
    client.setAlwaysOnTop({ isAlwaysOnTop: settings.isAlwaysOnTop })
  }, [settings])

  useEffect(() => {
    if (ref.current && !isLoaded)
      setIsLoaded(true)
  }, [isLoaded])

  console.log('render setting page')

  return (
    <div ref={ref} className="p-4 font-sans flex flex-col gap-2 text-sm bg-background h-[100vh] w-[100vw]">
      {
        // eslint-disable-next-line @stylistic/multiline-ternary
        isLoaded ? (
          <>
            <div className="flex flex-col gap-3 bg-secondary p-2 rounded-md">
              <LabeledInput
                label="上联" value={settings.upper}
                onChange={value => updateSetting('upper', value)}
              />
              <LabeledInput
                label="下联" value={settings.lower}
                onChange={value => updateSetting('lower', value)}
              />
              <LabeledInput
                label="横批" value={settings.middle}
                onChange={value => updateSetting('middle', value)}
              />
            </div>
            <div className="flex flex-col gap-3 bg-secondary p-2 rounded-md">
              <FontSelector
                value={settings.font} fonts={fonts}
                onValueChange={value => updateSetting('font', value)}
              />
              <LabeledNumberInput
                label="字体大小" value={settings.fontSize}
                onChange={handleFontSizeChange} min={30}
                max={120} step={1}
              />
              <ColorPicker
                label="字体颜色" value={settings.fontColor}
                onChange={color => updateSetting('fontColor', color)}
              />
              <ColorPicker
                label="背景颜色" value={settings.backgroundColor}
                onChange={color => updateSetting('backgroundColor', color)}
              />
            </div>
            <div className="flex flex-col gap-3 bg-secondary p-2 rounded-md">
              <LabeledNumberInput
                label="顶部偏移量" value={settings.topOffset}
                onChange={handleLineTopChange} min={0}
                max={300} step={1}
              />
              <LabeledNumberInput
                label="水平偏移量" value={settings.lineHorizontalOffset}
                onChange={handleLineHorizontalOffsetChange} min={0}
                max={300} step={1}
              />
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm">固定在屏幕最上层</span>
                <Switch checked={settings.isAlwaysOnTop} onCheckedChange={handleAlwaysOnTopChange} />
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-secondary p-2 rounded-md">
              <div className="flex items-center justify-between ">
                <span className="text-sm">问题反馈</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    client.openLink('https://github.com/liou666/couplet')
                  }}
                >
                  <i className="i-mdi-github w-4 h-4" />
                </Button>
              </div>
              {/* <div className="flex items-center justify-between bg-secondary">
            <span className="text-sm">
              版本号(
              {`v${version}`}
              )
            </span>
            <Button size="sm" variant="outline">
              检查更新
            </Button>
          </div> */}
            </div>
            <Button onClick={() => resetAllSettings()} className="mt-4">重置所有设置</Button>
          </>
        )
          : (<></>)
      }
    </div>
  )
}
