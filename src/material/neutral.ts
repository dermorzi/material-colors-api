import type { INeutralPalette, IToneColors, IRoleColors } from "./types.ts";
import { NEUTRAL_TONE_ROLES } from "./constants.ts";
import { toHct } from "./utilities.ts";
import { hexFromArgb, TonalPalette } from "@material/material-color-utilities";

export function createNeutralPalette(color?: string | number): INeutralPalette {
  if (color === undefined) {
    color = "#000000";
  }

  const hct = toHct(color);
  hct.chroma *= .1;
  const palette = TonalPalette.fromHct(hct);
  const themes: INeutralPalette["themes"] = {
    light: {} as IRoleColors,
    dark: {} as IRoleColors,
  };
  const tones: IToneColors = {}
  
  console.log('PALETTE', palette)

  for (let i = 0; i <= 100; ++i) {
    const color = palette.tone(i);
    tones[i] = hexFromArgb(color)
  }

  for (const [themeName, roles] of Object.entries(NEUTRAL_TONE_ROLES)) {
    const theme = themes[themeName as keyof typeof NEUTRAL_TONE_ROLES];
    for (const [role, tone] of Object.entries(roles)) {
      const color = palette.tone(tone as number);
      theme[role as string] = hexFromArgb(color);
    }
  }

  return { themes, tones };
}
