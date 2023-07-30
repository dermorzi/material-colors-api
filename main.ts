import express from "express";
import cors from "cors";
import compression from "compression";
import { Request, Response } from "express-serve-static-core";
import { createNeutralPalette, createTonalPalette } from "./palette.ts";
import { template } from "./template.ts";

const port = Deno.env.get("PORT") || "8080";
const app = express();

app.use(
  cors({
    origin: true,
  })
);
app.use(
  compression({
    level: 10,
  })
);

app.get(["/tonal/:color"], (req: Request, res: Response) => {
  const { color } = req.params;
  const palette = createTonalPalette("#" + color);
  res.json(palette);
});

app.get(["/neutral", "/neutral/:color"], (req: Request, res: Response) => {
  const { color } = req.params;
  const palette = createNeutralPalette(color ? "#" + color : undefined);
  res.json(palette);
});

app.use("*", (req: Request, res: Response) => {
  const isHome = req.originalUrl === "/";
  const title = isHome ? "Material Colors API" : "404 - Page not found";
  res.status(isHome ? 200 : 404).send(template(title));
});

app.listen(port);
