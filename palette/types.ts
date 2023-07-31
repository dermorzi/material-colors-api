export type ToneColors = { [key: number]: string };

export type RoleColors = { [key: string]: string };

export interface CustomColor {
  name: string;
  value: number;
  blend: boolean;
}

export interface Themes {
  dark: RoleColors;
  light: RoleColors;
}

export interface TonalPalette {
  tones: ToneColors;
  themes: Themes;
}

export interface NeutralPalette {
  themes: Themes;
}

export type HCT = {
  [key: string]: unknown;
  hue: number;
  chroma: number;
};
