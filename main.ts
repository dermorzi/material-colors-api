import express from "express";
import cors from "cors";
import compression from "compression";
import { router } from "./router.ts";

const port = Deno.env.get("PORT") || "8080";
const app = express();

app.use(
  cors({
    origin: true,
  })
);
app.use(
  compression({
    level: 9,
  })
);

app.use("/", router);

app.listen(port);
