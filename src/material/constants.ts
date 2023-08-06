import { RolesMap } from './types.ts'

function extractTonesFromMap(map: RolesMap) {
  const tones = new Set()

  for (const [_, light, dark] of Object.values(map)) {
    if (typeof light !== 'number' || typeof dark !== 'number') {
      continue
    }

    tones.add(light).add(dark)
  }

  return Array.from(tones).sort() as number[]
}

export const SUPPORTED_COLOR_FORMATS = ['hex', 'rgb', 'rgba', 'hsl'] as const

export const PALETTE_NAMES = ['primary', 'secondary', 'tertiary', 'neutral', 'neutralVariant', 'error'] as const

export const NEUTRAL_ROLES: Readonly<RolesMap> = {
  surfaceDim: ['neutral', 87, 6],
  surface: ['neutral', 98, 6],
  surfaceBright: ['neutral', 98, 24],
  surfaceContainerLowest: ['neutral', 100, 4],
  surfaceContainerLow: ['neutral', 96, 10],
  surfaceContainer: ['neutral', 94, 12],
  surfaceContainerHigh: ['neutral', 92, 17],
  surfaceContainerHighest: ['neutral', 90, 22],
  onSurface: ['neutralVariant', 10, 90],
  onSurfaceVariant: ['neutralVariant', 30, 80],
  outline: ['neutralVariant', 50, 60],
  outlineVariant: ['neutralVariant', 80, 30],
}

export const NEUTRAL_TONES = [...extractTonesFromMap(NEUTRAL_ROLES)] as const

export const TONAL_ROLES: Readonly<RolesMap> = {
  name: ['primary', 40, 80],
  onName: ['primary', 100, 20],
  nameContainer: ['primary', 90, 30],
  onNameContainer: ['primary', 10, 90],
}

export const TONAL_TONES = [...extractTonesFromMap(TONAL_ROLES)] as const
