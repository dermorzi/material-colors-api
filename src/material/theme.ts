import { argbFromHex, themeFromSourceColor } from "@material/material-color-utilities"
import { createPalette, isEvenColor } from "./index.ts"
import { CustomColorInput, Palette, Roles, SupportedColorFormat, Theme } from "./types.ts"
import { NEUTRAL_ROLES, SUPPORTED_COLOR_FORMATS, TONAL_ROLES } from "./constants.ts"
import { extractArgb, isHexString } from "./utilities.ts"
import { CustomError } from "utils";

function prepareCustoms(colors: string[]) {
  const customs: CustomColorInput[] = []

  for (const [index, value] of Object.entries(colors)) {
    let color: string = value
    let name: string | undefined = undefined

    if (value.includes(":")) {
      [name, color] = value.split(":")
    }

    customs.push({
      name: name !== undefined ? name : `custom${index}`,
      value: argbFromHex("#" + color),
      blend: true,
    })
  }

  return customs
}

function stripData(data: typeof themeFromSourceColor, evenColor: boolean) {
  const { palettes, customColors } = data
  const base: { [key: string]: number | null } = {}
  const customs: { [key: string]: number } = {}

  for (const [name, palette] of Object.entries(palettes)) {
    if (evenColor && [] ) {
      base[name] = null
    }

    const argb = extractArgb(palette)

    if (argb) {
      base[name] = argb
    }
  }

  for (const { color, value } of customColors) {
    customs[color.name] = value
  }

  return { base, customs }
}

function buildPalettes(colors: { [name: string]: number | null }, target: string) {
  const palettes = {} as { [name: string]: Palette }

  for (const [name, argb] of Object.entries(colors)) {
    if (argb) {
      const neutral = ['neutral', 'neutralVariant'].includes(name)
      const palette = createPalette(argb, target as SupportedColorFormat, neutral)
      palettes[name] = palette as Palette
    }
  }

  return palettes
}

function buildTonalVariables(name: string, palette: Palette, theme: Theme['roles']['default']) {
  theme.light = theme.light || {} as Roles
  theme.dark = theme.dark || {} as Roles

  for (const [variable, config] of Object.entries(TONAL_ROLES)) {
    const [_, _light, _dark] = config
    const upperName = name.charAt(0).toUpperCase() + name.slice(1)
    const key = variable.startsWith('name')
      ? variable.replace('name', name)
      : variable.replace('Name', upperName)

    theme.light[key] = palette[_light]
    theme.dark[key] = palette[_dark]
  }
}

function buildRoleVariables(palettes: Theme['palettes']) {
  const themes = { default: {}, customs: {}} as Theme['roles']

  for (const [name, palette] of Object.entries(palettes.customs)) {
    buildTonalVariables(name, palette, themes.customs)
  }

  for (const [name, palette] of Object.entries(palettes.default)) {
    if (['neutral', 'neutralVariant'].includes(name)) {
      continue;
    }

    buildTonalVariables(name, palette, themes.default)
  }

  const { neutral, neutralVariant } = palettes.default
  themes.default.light = themes.default.light || {}
  themes.default.dark = themes.default.dark || {}

  for (const [key, config] of Object.entries(NEUTRAL_ROLES)) {
    const [name, dark, light] = config
    themes.default.light[key] = name === 'neutral' ? neutral[light] : neutralVariant[light]
    themes.default.dark[key] = name === 'neutral' ? neutral[dark] : neutralVariant[dark]
  }

  return themes
}

export function createTheme(query: { [name: string]: string | string[] }) {
  let { name, color, custom, target } = query
  color = Array.isArray(color) ? color[0] : color
  target = Array.isArray(target) ? target[0] : target

  if (color === undefined || isHexString(color) === false) {
    return new CustomError(
      'ColorError',
      `Color ${color} is not a valid! The must be a CSS hex color without the number sign (#).`
    )
  }

  if (custom === undefined || typeof custom === 'string' || Array.isArray(custom) === false) {
    custom = []
  }

  target = SUPPORTED_COLOR_FORMATS.includes(target as SupportedColorFormat) ? target : 'hex'

  const preTheme = themeFromSourceColor(argbFromHex(color), prepareCustoms(custom))
  const { base, customs } = stripData(preTheme, isEvenColor(color))
  const theme = {
    name: typeof name === 'string' ? name : null,
    source: `#${color}`,
  } as Theme

  theme.palettes = {
    default: buildPalettes(base, target),
    customs: buildPalettes(customs, target),
  } as Theme['palettes']

  if (isEvenColor(color)) {
    theme.palettes.default = {
      neutral: theme.palettes.default.neutral,
      neutralVariant: theme.palettes.default.neutralVariant,
    } as Theme['palettes']['default']
  }

  theme.roles = buildRoleVariables(theme.palettes)

  return theme;
}
