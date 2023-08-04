export const TONES = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100,
] as const;

export const TONE_ROLES = {
  light: {
    primary: 40,
    onPrimary: 100,
    primaryContainer: 90,
    onPrimaryContainer: 10,
  },
  dark: {
    primary: 80,
    onPrimary: 20,
    primaryContainer: 30,
    onPrimaryContainer: 90,
  },
} as const;

export const NEUTRAL_TONE_ROLES = {
  light: {
    surfaceDim: 87,
    surface: 98,
    surfaceBright: 98,
    surfaceContainerLowest: 100,
    surfaceContainerLow: 96,
    surfaceContainer: 94,
    surfaceContainerHigh: 92,
    surfaceContainerHighest: 90,
    onSurface: 10,
    onSurfaceVariant: 30,
    onOutline: 50,
    onOutlineVariant: 80,
  },
  dark: {
    surfaceDim: 6,
    surface: 6,
    surfaceBright: 24,
    surfaceContainerLowest: 4,
    surfaceContainerLow: 10,
    surfaceContainer: 12,
    surfaceContainerHigh: 17,
    surfaceContainerHighest: 22,
    onSurface: 90,
    onSurfaceVariant: 80,
    onOutline: 60,
    onOutlineVariant: 30,
  },
} as const;
