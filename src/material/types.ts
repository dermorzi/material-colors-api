export interface IToneColors {
  [key: number]: string
}

export interface IRoleColors {
  [key: string]: string
}

export interface ICustomColor {
  name: string;
  value: number;
  blend: boolean;
}

export interface ITonalPalette {
  tones: IToneColors;
  themes: IThemes;
}

export interface INeutralPalette {
  tones: IToneColors;
  themes: IThemes;
}

export interface IHCTColor {
  [key: string]: unknown;
  hue: number;
  chroma: number;
}

export interface IPalette {
  [key: string]: unknown;
  keyColor: {
    [key: string]: unknown;
    argb: number;
  };
}

export interface IPalettes {
  [key: string]: IPalette;
}

export interface ICustomPalette {
  name: string;
  source: string;
  themes: IThemes;
  tones: IToneColors;
}

export interface ITheme {
  source: string;
  palettes: {
    [key: string]: IToneColors;
  };
  themes: IThemes;
  customPalettes: ICustomPalette[];
}

export interface IThemes {
  dark: IRoleColors;
  light: IRoleColors;
}