import { SUPPORTED_COLOR_FORMATS, PALETTE_NAMES } from './constants.ts'

export type SupportedColorFormat = typeof SUPPORTED_COLOR_FORMATS[number]

export type PaletteNames = typeof PALETTE_NAMES[number]

export type Palette<T = string | number> = { [tone: number]: T }

export type CustomPaletteNames<T> = T extends PaletteNames ? never : T

export type RolesMap = { [key: string]: [color: PaletteNames, light: number, dark: number] }

export type CustomColorInput = {
  name: string
  value: string
  blend?: boolean
}

export type Roles = { [role: string]: number | string | number[] }

export type Theme = {
  name: string | null
  source: string
  palettes: {
    default: {  [name in PaletteNames]: Palette }
    customs: {  [name in PaletteNames]: Palette }
  },
  roles: {
    default: {
      light: Roles
      dark: Roles
    }
    customs: {
      light: Roles
      dark: Roles
    }
  }
}
