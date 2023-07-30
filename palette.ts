import {
  applyTheme,
  argbFromHex,
  Hct,
  hexFromArgb,
  themeFromSourceColor,
  TonalPalette,
} from "@material/material-color-utilities";

type ToneColors = { [key: number]: string };
type RoleColors = { [key: string]: string };

function getHCT(hex: string) {
  const argb = argbFromHex(hex);
  return Hct.fromInt(argb);
}

const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const;
const toneRoles = {
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
const neutralToneRoles = {
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

export function createNeutralPalette(hex?: string) {
  if (hex) {
    hex = "#" + hex;
  }

  hex = hex || "#000000";
  const hct = getHCT(hex);
  const palette = TonalPalette.fromHueAndChroma(hct.hue, hct.chroma * 0.1);
  const colors = {
    light: {} as RoleColors,
    dark: {} as RoleColors,
  };

  for (const [themeName, roles] of Object.entries(neutralToneRoles)) {
    const theme = colors[themeName as keyof typeof neutralToneRoles];
    for (const [role, tone] of Object.entries(roles)) {
      const color = palette.tone(tone as number);
      theme[role as string] = hexFromArgb(color);
    }
  }

  return { roles: colors };
}

export function createTonalPalette(hex: string) {
  hex = "#" + hex;
  const hct = getHCT(hex);
  const palette = TonalPalette.fromHct(hct);
  const colors = {
    tones: {} as ToneColors,
    roles: {
      light: {} as RoleColors,
      dark: {} as RoleColors,
    },
  };

  for (const tone of tones) {
    const color = palette.tone(tone);
    colors.tones[tone] = hexFromArgb(color);
  }

  for (const [theme, roles] of Object.entries(toneRoles)) {
    for (const [name, tone] of Object.entries(roles)) {
      const color = palette.tone(tone);
      colors.roles[theme as keyof typeof toneRoles][name] = hexFromArgb(color);
    }
  }

  return colors;
}

export function generateThemeFromColor(hex: string) {
  hex = "#" + hex;
  const argb = argbFromHex(hex);
  const theme = themeFromSourceColor(argb);

  const dark = applyTheme(theme, { dark: true });

  return dark;
}
