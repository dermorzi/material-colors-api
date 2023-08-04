import type { IRoleColors, ITonalPalette, IToneColors } from "./types.ts";
import { TONES, TONE_ROLES } from "./constants.ts";
import { toHct } from "./utilities.ts";
import {
  argbFromHex,
  hexFromArgb,
  TonalPalette,
} from "@material/material-color-utilities";

export function createTonalPalette (color: string | number): ITonalPalette {
  color = (
    typeof color === "string" ? argbFromHex("#" + color) : color
  ) as number;

  const hct = toHct(color);
  const palette = TonalPalette.fromHct(hct);
  const colors = {
    tones: {} as IToneColors,
    themes: {
      light: {} as IRoleColors,
      dark: {} as IRoleColors,
    },
  };

  for (const tone of TONES) {
    const color = palette.tone(tone);
    colors.tones[tone] = hexFromArgb(color);
  }

  for (const [theme, roles] of Object.entries(TONE_ROLES)) {
    for (const [name, tone] of Object.entries(roles)) {
      const color = palette.tone(tone);
      colors.themes[theme as keyof typeof TONE_ROLES][name] =
        hexFromArgb(color);
    }
  }

  return colors;
}
