import express from "https://esm.sh/express@4.18.2";
import cors from "https://esm.sh/cors@2.8.5";
import compression from "https://esm.sh/compression@1.7.4";
import {
  Request,
  Response,
} from "https://esm.sh/express-serve-static-core@0.1.1";
import { createNeutralPalette, createTonalPalette } from "./palette.ts";

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

const endpoints = `
<h2>Available endpoints</h2>
<p>[color] is hexadecimal CSS color without the #</p>
<ul>
  <li>/tonal/[color]</li>
  <li>/neutral</li>
  <li>/neutral/[color]</li>
</ul>
`;

const template = (title: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta charset="UTF-8">
    <title>${title}</title>
  </head>
</html>
<body>
  <h1>${title}</h1>
  ${endpoints}
</body>
</html>
`;

app.use("*", (req: Request, res: Response) => {
  const isHome = req.originalUrl === "/";
  const title = isHome ? "Material Colors API" : "404 - Page not found";
  res.status(isHome ? 200 : 404).send(template(title));
});

app.listen(port);
