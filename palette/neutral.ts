import { NeutralPalette, type RoleColors } from "./types.ts";
import { NEUTRAL_TONE_ROLES } from "./constants.ts";
import { toHct } from "../utilities.ts";
import { hexFromArgb, TonalPalette } from "@material/material-color-utilities";

export default function (color?: string | number): NeutralPalette {
  if (color === undefined) {
    color = "#000000";
  }

  const hct = toHct(color);
  const palette = TonalPalette.fromHueAndChroma(hct.hue, hct.chroma * 0.1);
  const themes: NeutralPalette["themes"] = {
    light: {} as RoleColors,
    dark: {} as RoleColors,
  };

  for (const [themeName, roles] of Object.entries(NEUTRAL_TONE_ROLES)) {
    const theme = themes[themeName as keyof typeof NEUTRAL_TONE_ROLES];
    for (const [role, tone] of Object.entries(roles)) {
      const color = palette.tone(tone as number);
      theme[role as string] = hexFromArgb(color);
    }
  }

  return { themes };
}
