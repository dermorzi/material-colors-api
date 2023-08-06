import { NEUTRAL_TONES, TONAL_TONES } from './constants.ts'
import { TonalPalette } from '@material/material-color-utilities'
import { SupportedColorFormat } from './types.ts'
import { valueToFormat } from "./utilities.ts";

export function createPalette(argb: number, target: SupportedColorFormat, neutral?: boolean) {
  const palette: { [key: number]: unknown } = {}
  const generator = TonalPalette.fromInt(argb)
  const tones = neutral === true ? NEUTRAL_TONES : TONAL_TONES

  for (const value of tones) {
    palette[value as number] = valueToFormat(target, generator.tone(value))
  }

  return palette
}
