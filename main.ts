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
  const palette = createTonalPalette(color.replace("0x", "#"));
  res.json(palette);
});

app.get(["/neutral", "/neutral/:color"], (req: Request, res: Response) => {
  const { color } = req.params;
  const palette = createNeutralPalette(color);
  res.json(palette);
});

app.use("*", (req: Request, res: Response) => {
  const isHome = req.originalUrl === "/";
  res.status(isHome ? 200 : 404).send(`
<meta name="color-scheme" content="light dark">
${isHome ? "<h1>Material Colors API</h1>" : "<h1>404 - Page not found</h1>"}
<p>
  ${isHome ? "" : "This is not a valid endpoint!<br>"}
  Please use one of the following:<p>
<ul>
  <li>/tonal/[color]</li>
  <li>/neutral</li>
  <li>/neutral/[color]</li>
</ul>
<p>Colors are hexadecimal and starts with '0x' instead of '#'</p>
    `);
});

app.listen(port);
