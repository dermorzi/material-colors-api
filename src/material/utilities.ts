import chroma from 'chroma-js'
import { SupportedColorFormat } from './types.ts'
import { hexFromArgb } from '@material/material-color-utilities'

export function isHexString(str: string): boolean {
  str = str.startsWith('#') ? str.slice(1) : str
  const acceptedLengths = [3, 6, 8]
  const regex = /^[0-9,A-F,a-f]+$/

  if (acceptedLengths.includes(str.length) === false) {
    return false
  }

  if (regex.test(str) === false) {
    return false
  }

  return true
}

export function isEvenColor(str: string): boolean {
  if (isHexString(str) === false) {
    return false
  }

  if (str.startsWith('#')) {
    str = str.slice(1)
  }

  const parts = str.slice(0, 6).toUpperCase().split('')
  const size: number = str.length === 6 ? 2 : 1
  const chunks: string[] = []

  while (parts.length) {
    chunks.push(parts.splice(0, size).join(''))
  }

  return chunks.every((v) => v === chunks[0])
}

export function extractArgb(palette: unknown): number | null {
  if (palette && typeof palette === 'object' && 'keyColor' in palette) {
    const { keyColor } = palette
    if (keyColor && typeof keyColor === 'object' && 'argb' in keyColor) {
      const argb = keyColor.argb
      return typeof argb === 'number' ? argb : null
    }
  }

  return null
}

export function valueToFormat(format: SupportedColorFormat, value: number) {
  const hex = typeof value === 'string' ? value : hexFromArgb(value)

  if (format === 'hex') {
    return hex
  }

  let color = chroma(hex)[format](true) as number[]

  if (format === 'rgb' || format === 'rgba') {
    color = color.map((num) => Math.round(num * 100) / 100)
  } else {
    const [hue, saturation, lightness, alpha] = color
    color = [
      Math.round(hue) || 0,
      Math.round(saturation * 100_000) / 1_000,
      Math.round(lightness * 100_000) / 1_000,
      Math.round(alpha * 1_000) / 1_000,
    ]
  }

  return color
}
