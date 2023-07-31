import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import {
  CustomColor,
  RoleColors,
  Themes,
  TonalPalette,
} from "./palette/types.ts";
import { Tonal } from "./palette/index.ts";

interface Palette {
  [key: string]: unknown;
  keyColor: {
    [key: string]: unknown;
    argb: number;
  };
}

interface Palettes {
  [key: string]: Palette;
}

interface CustomPalette {
  name: string;
  source: string;
  themes: Themes;
  tones: { [key: string]: string };
}

interface Theme {
  source: string;
  palettes: {
    [key: string]: TonalPalette;
  };
  themes: Themes;
  customPalettes: CustomPalette[];
}

function valuesToHex(obj: { [key: string]: number }) {
  const result: RoleColors = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = hexFromArgb(value);
  }

  return result;
}

function renameProperties<T extends object>(
  name: string,
  replace: string,
  obj: T
): T {
  const renamed: { [key: string]: unknown } = {};

  for (const key of Object.keys(obj)) {
    if (key.includes(name)) {
      renamed[key.replace(name, replace)] = obj[key as keyof T];
      continue;
    }

    const capitalizedName = name
      .split("")
      .map((c, i) => (i === 0 ? c.toUpperCase() : c))
      .join("");

    if (key.includes(capitalizedName)) {
      const capitalizedReplace = replace
        .split("")
        .map((c, i) => (i === 0 ? c.toUpperCase() : c))
        .join("");
      renamed[key.replace(capitalizedName, capitalizedReplace)] =
        obj[key as keyof T];
      continue;
    }

    renamed[key] = obj[key as keyof T];
  }

  return renamed as T;
}

function prepareCustomColors(customColors: string[]) {
  const customs: CustomColor[] = [];

  for (const custom of customColors) {
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
      name: `custom${customColors.indexOf(custom)}`,
      value: argbFromHex("#" + custom),
      blend: true,
    });
  }

  return customs;
}

function preparePalettes(palettes: Palettes) {
  const colors: [name: string, argb: number][] = [];

  for (const [name, p] of Object.entries(palettes)) {
    const argb = p.keyColor.argb;
    colors.push([name, argb]);
  }

  return colors;
}

function buildTheme(argb: number, customs: CustomColor[] = []): Theme {
  const theme: Theme = {
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

  for (const [name, argb] of preparePalettes(_palettes)) {
    const { tones } = Tonal(argb);
    theme.palettes[name] = tones;
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
      tones: Tonal(color.value).tones,
    });
  }

  return theme;
}

export default function ThemeFromColor(
  color: string | number,
  customColors?: string[]
) {
  color = (
    typeof color === "string" ? argbFromHex("#" + color) : color
  ) as number;
  let customs: CustomColor[] = [];

  if (customColors) {
    customs = prepareCustomColors(customColors);
  }

  return buildTheme(color, customs);
}
