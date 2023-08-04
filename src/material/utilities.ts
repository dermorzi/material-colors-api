import { IHCTColor, IRoleColors } from './types.ts'
import { argbFromHex, hexFromArgb, Hct } from '@material/material-color-utilities';

export function isHexString(str: string): boolean {
  const acceptedLengths = [3, 6, 8];
  const regex = /^[0-9,A-F,a-f]+$/;

  return acceptedLengths.includes(str.length) && regex.test(str);
}

export function isEvenColor(str: string): boolean {
  const parts = str.toUpperCase().split('')
  const size: number = str.length === 6 ? 2 : 1
  const chunks: string[] = []

  while(parts.length) {
    chunks.push(parts.splice(0, size).join(''));
  }

  return chunks.every(v => v === chunks[0])
}

export function valuesToHex(obj: { [key: string]: number }) {
  const result: IRoleColors = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = hexFromArgb(value);
  }

  return result;
}

export function toHct(color: string | number): IHCTColor {
  if (typeof color === "string") {
    const argb = argbFromHex(color);
    return Hct.fromInt(argb);
  }

  return Hct.fromInt(color);
}
