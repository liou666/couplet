import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@renderer/components/ui/select'
import { Switch } from '@renderer/components/ui/switch'
import useFont from '@renderer/hooks/useFont'
import { useLocalStorage } from '@renderer/hooks/useLocalStorage'
import { client } from '@renderer/ipc/client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// 文本输入组件
const TextInput = React.memo(({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <Input value={value} onChange={handleChange} />
    </div>
  )
})

// 颜色选择器组件
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
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setLocalColor(newColor)

    if (timeoutRef.current)
      clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      onChange(newColor)
    }, 10)
  }, [onChange])

  useEffect(() => {
    setLocalColor(value)
  }, [value])

  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={localColor}
          onChange={handleColorChange}
          className="w-[60px] h-[40px] p-1"
        />
        <div className="text-sm text-gray-500">{localColor}</div>
      </div>
    </div>
  )
})

// 字体选择器组件
const FontSelector = React.memo(({
  value,
  fonts,
  onValueChange,
}: {
  value: string
  fonts: string[]
  onValueChange: (value: string) => void
}) => {
  const fontItems = useMemo(() => {
    return fonts.map(font => (
      <SelectItem key={font} value={font}>{font}</SelectItem>
    ))
  }, [fonts])

  return (
    <div className="flex items-center gap-2">
      <span>fontStyle</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          {fontItems}
        </SelectContent>
      </Select>
    </div>
  )
})

// 数字输入组件
const NumberInput = React.memo(({
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
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  )
})

// 主组件
export default function Page() {
  const { fonts } = useFont()
  const [settings, setSettings] = useLocalStorage('setting', {
    upper: '',
    lower: '',
    fontSize: 30,
    backgroundColor: '#ef4444',
    fontColor: '#000',
    font: 'normal',
    middle: '',
    isAlwaysOnTop: false,
    top: 100,
    lineHorizontalOffset: 200,
  })

  // 使用 useCallback 包装所有更新函数
  const updateSetting = useCallback(<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [setSettings])

  const handleAlwaysOnTopChange = useCallback((value: boolean) => {
    client.setAlwaysOnTop({ isAlwaysOnTop: value })
    updateSetting('isAlwaysOnTop', value)
  }, [updateSetting])

  const handleLineTopChange = useCallback((value: number) => {
    client.setLineTop({ top: value })
    updateSetting('top', value)
  }, [updateSetting])

  const handleLineHorizontalOffsetChange = useCallback((value: number) => {
    client.setLineHorizontalOffset({ offset: value })
    updateSetting('lineHorizontalOffset', value)
  }, [updateSetting])

  return (
    <div className="p-4 font-sans flex flex-col gap-4">
      <TextInput
        label="上"
        value={settings.upper}
        onChange={value => updateSetting('upper', value)}
      />
      <TextInput
        label="下"
        value={settings.lower}
        onChange={value => updateSetting('lower', value)}
      />
      <TextInput
        label="中"
        value={settings.middle}
        onChange={value => updateSetting('middle', value)}
      />
      <NumberInput
        label="line top"
        value={settings.top}
        onChange={handleLineTopChange}
        min={30}
        max={300}
        step={1}
      />
      <NumberInput
        label="LineHorizontalOffset"
        value={settings.lineHorizontalOffset}
        onChange={handleLineHorizontalOffsetChange}
        min={30}
        max={300}
        step={1}
      />
      <NumberInput
        label="font size"
        value={settings.fontSize}
        onChange={value => updateSetting('fontSize', value)}
        min={30}
        max={70}
        step={1}
      />
      <ColorPicker
        label="fontColor"
        value={settings.fontColor}
        onChange={color => updateSetting('fontColor', color)}
      />
      <ColorPicker
        label="bgColor"
        value={settings.backgroundColor}
        onChange={color => updateSetting('backgroundColor', color)}
      />
      <FontSelector
        value={settings.font}
        fonts={fonts}
        onValueChange={value => updateSetting('font', value)}
      />
      <div className="flex items-center gap-2">
        <span>always on top</span>
        <Switch
          checked={settings.isAlwaysOnTop}
          onCheckedChange={handleAlwaysOnTopChange}
        />
      </div>
      <Button
        onClick={() => setSettings(settings)}
        className="mt-4"
      >
        保存
      </Button>
    </div>
  )
}
