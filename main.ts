import express from "npm:express@latest";
import { Request, Response } from "npm:express-serve-static-core@latest";

import {
  Hct,
  argbFromHex,
  hexFromArgb,
  TonalPalette,
} from "npm:@material/material-color-utilities@latest";

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

function createNeutralPalette(hex?: string) {
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

  return colors;
}

function createTonalPalette(hex: string) {
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

const port = Deno.env.get("PORT") || "8080";
const app = express();

app.get(["/tonal/:color"], (req: Request, res: Response) => {
  const { color } = req.params;
  const palette = createTonalPalette(color.replace("0x", "#"));
  res.json(palette);
});

app.get(["/neutral", "/neutral/:color"], (req: Request, res: Response) => {
  const { color } = req.params;
  const palette = createNeutralPalette(color);
  res.json(palette);
});

app.use("*", (_: Request, res: Response) => {
  res.status(404).send(`
<h1>404 - Page not found</h1>
<p>This is not a valid endpoint!<br>Please use one of the following:<p>
<ul>
  <li>/tonal/:color</li>
  <li>/neutral</li>
  <li>/neutral/:color</li>
</ul>
    `);
});

app.listen(port);
