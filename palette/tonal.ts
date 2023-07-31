import type { RoleColors, ToneColors } from "./types.ts";
import { TONES, TONE_ROLES } from "./constants.ts";
import { toHct } from "../utilities.ts";
import {
  argbFromHex,
  hexFromArgb,
  TonalPalette,
} from "@material/material-color-utilities";

export default function (color: string | number): TonalPalette {
  color = (
    typeof color === "string" ? argbFromHex("#" + color) : color
  ) as number;

  const hct = toHct(color);
  const palette = TonalPalette.fromHct(hct);
  const colors = {
    tones: {} as ToneColors,
    themes: {
      light: {} as RoleColors,
      dark: {} as RoleColors,
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
