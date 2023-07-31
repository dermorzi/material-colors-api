import express from "express";
import { Request, Response } from "express-serve-static-core";
import { isHexString } from "./utilities.ts";
import { Neutral, Tonal } from "./palette/index.ts";
import createTheme from "./theme.ts";

export const router = express.Router();
const colorError = (color: unknown) => ({
  color,
  msg: `Provided color is not a valid hexadecimal CSS color.`,
});

router.get("/neutral", (req: Request, res: Response) => {
  const { color } = req.query;

  if (color && isHexString(color) === false) {
    return res.status(400).json(colorError(color));
  }

  res.json(Neutral(color));
});

router.get("/theme", (req: Request, res: Response) => {
  const { color, custom: customs } = req.query;

  if (typeof color !== "string" || isHexString(color) === false) {
    return res.status(400).json(colorError(color));
  }

  const palette = createTheme(color, customs);
  res.json(palette);
});

router.get("/tonal", (req: Request, res: Response) => {
  const { color } = req.query;

  if (typeof color !== "string" || isHexString(color) === false) {
    return res.status(400).json(colorError(color));
  }

  return res.json(Tonal(color));
});

router.use(async (req: Request, res: Response) => {
  const isHome = req.originalUrl === "/";

  if (isHome) {
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile("./index.html");
    const html = decoder.decode(data);
    return res.status(200).send(html);
  }

  return res.status(404).json({
    msg: "Not found",
    endpoints: ["/neutral", "/theme", "/tonal"],
  });
});
