import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import type {
  ICustomColor,
  IPalettes,
  ITheme,
} from "./index.ts";
import { createNeutralPalette, createTonalPalette, valuesToHex } from "./index.ts";
import { renameProperties } from "utils";

function prepareICustomColors(ICustomColors: string[]) {
  const customs: ICustomColor[] = [];

  for (const custom of ICustomColors) {
    if (custom.includes(":")) {
      const [name, c] = custom.split(":");
      customs.push({
        name,
        value: argbFromHex("#" + c),
        blend: true,
      });
      continue;
    }

    customs.push({
      name: `custom${ICustomColors.indexOf(custom)}`,
      value: argbFromHex("#" + custom),
      blend: true,
    });
  }

  return customs;
}

function prepareIPalettes(IPalettes: IPalettes) {
  const colors: [name: string, argb: number][] = [];

  for (const [name, p] of Object.entries(IPalettes)) {
    const argb = p.keyColor.argb;
    colors.push([name, argb]);
  }

  return colors;
}

function buildTheme(argb: number, customs: ICustomColor[] = []): ITheme {
  const theme: ITheme = {
    source: "",
    palettes: {},
    themes: {
      dark: {},
      light: {},
    },
    customPalettes: [],
  };
  const {
    palettes: _palettes,
    schemes,
    source,
    customColors,
  } = themeFromSourceColor(argb, customs);

  theme.source = hexFromArgb(source);

  for (const [name, argb] of prepareIPalettes(_palettes)) {
    if (['neutral', 'neutralVariant'].includes(name)) {
      const p = createNeutralPalette(argb);
      theme.palettes[name] = p.tones;
      continue;
    }

    const p = createTonalPalette(argb);
    theme.palettes[name] = p.tones;
  }

  theme.themes.dark = valuesToHex(schemes.dark.props);
  theme.themes.light = valuesToHex(schemes.light.props);

  for (const { color, value, light, dark } of customColors) {
    theme.customPalettes.push({
      name: color.name,
      source: hexFromArgb(value),
      themes: {
        dark: renameProperties("color", color.name, valuesToHex(dark)),
        light: renameProperties("color", color.name, valuesToHex(light)),
      },
      tones: createTonalPalette(color.value).tones,
    });
  }

  return theme;
}

export function createTheme(
  color: string | number,
  customColors?: string[]
) {
  color = (
    typeof color === "string" ? argbFromHex("#" + color) : color
  ) as number;
  let customs: ICustomColor[] = [];

  if (customColors && customColors.length > 0) {
    customs = prepareICustomColors(customColors);
  }

  return buildTheme(color, customs);
}
