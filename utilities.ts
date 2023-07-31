import { HCT } from "./palette/types.ts";
import { argbFromHex, Hct } from "@material/material-color-utilities";

export function toHct(color: string | number): HCT {
  if (typeof color === "string") {
    const argb = argbFromHex(color);
    return Hct.fromInt(argb);
  }

  return Hct.fromInt(color);
}

export function isHexString(str: string): boolean {
  const acceptedLengths = [3, 6, 8];
  const regex = /^[0-9,A-F,a-f]+$/;

  return acceptedLengths.includes(str.length) && regex.test(str);
}
