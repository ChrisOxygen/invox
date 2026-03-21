'use client'

import { useRef, useState } from 'react'

export interface BrandColorPickerProps {
  value: string
  onChange: (value: string) => void
}

const PRESET_COLORS = [
  { hex: '#1740F5', label: 'Brand Blue' },
  { hex: '#0ECB7A', label: 'Success Green' },
  { hex: '#F5A623', label: 'Warning Amber' },
  { hex: '#1C1C3A', label: 'Ink Dark' },
  { hex: '#F53A3A', label: 'Error Red' },
  { hex: '#00D4E8', label: 'Cyan' },
]

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

export function BrandColorPicker({ value, onChange }: BrandColorPickerProps) {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [hexInput, setHexInput] = useState(value)
  const [hexError, setHexError] = useState<string | null>(null)

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setHexInput(raw)
    setHexError(null)
  }

  function handleHexInputBlur() {
    const trimmed = hexInput.trim()
    const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
    if (HEX_REGEX.test(withHash)) {
      setHexError(null)
      setHexInput(withHash)
      onChange(withHash)
    } else {
      setHexError('Enter a valid hex color (e.g. #1740F5)')
    }
  }

  function handleNativePicker(e: React.ChangeEvent<HTMLInputElement>) {
    const newColor = e.target.value
    setHexInput(newColor)
    setHexError(null)
    onChange(newColor)
  }

  function handlePresetClick(hex: string) {
    setHexInput(hex)
    setHexError(null)
    onChange(hex)
  }

  const displayColor = HEX_REGEX.test(value) ? value : '#1740F5'

  return (
    <div className="flex flex-col gap-3">
      {/* Hex input + swatch button */}
      <div className="flex items-center gap-2">
        {/* Color swatch — clicking opens native picker */}
        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          aria-label="Open color picker"
          className="h-11 w-11 shrink-0 rounded-md border-2 border-(--border-strong) transition-all duration-200 hover:border-(--blue-600) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--blue-600) focus-visible:ring-offset-2"
          style={{ backgroundColor: displayColor }}
        />
        {/* Hidden native color input */}
        <input
          ref={colorInputRef}
          type="color"
          value={displayColor}
          onChange={handleNativePicker}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Hex text input */}
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInputChange}
          onBlur={handleHexInputBlur}
          placeholder="#1740F5"
          maxLength={7}
          className="h-11 w-full rounded-md border border-(--border-default) bg-(--surface-base) px-3.5 text-[14px] text-(--ink-900) placeholder:text-(--ink-300) transition-colors duration-200 focus:border-(--blue-600) focus:outline-none focus:ring-2 focus:ring-(--blue-600)/20 font-mono"
        />
      </div>

      {hexError && (
        <p className="text-[11px] text-(--error) [font-family:var(--font-body)]" role="alert">
          {hexError}
        </p>
      )}

      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map(({ hex, label }) => (
          <button
            key={hex}
            type="button"
            onClick={() => handlePresetClick(hex)}
            aria-label={`Use ${label} (${hex})`}
            className={[
              'h-8 w-8 rounded border-2 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--blue-600) focus-visible:ring-offset-2',
              value.toLowerCase() === hex.toLowerCase()
                ? 'border-(--ink-900) shadow-sm'
                : 'border-transparent',
            ].join(' ')}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  )
}
