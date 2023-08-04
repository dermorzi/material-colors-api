import Route from './lib/route.ts'
import { isHexString } from "./material/utilities.ts";
import { createNeutralPalette, createTonalPalette, createTheme } from "./material/index.ts";
import { ITheme } from "./material/types.ts";

export const root = new Route('/')

const colorError = (color: unknown) => ({
  color,
  msg: `Provided color is not a valid hexadecimal CSS color.`,
});

function buildCssVariables(theme: ITheme) {
  console.log(theme)
  return `
:root {}

@media (prefers-color-scheme: dark) {
  :root {}
}
  `
}

root.add("/neutral").get(({ search }) => {
  const color: string | null = search.get('color')

  console.log(color)

  if (color === null || (color && isHexString(color.toString()) === false)) {
    return Response.json(colorError(color), { status: 404 });
  }

  return Response.json(createNeutralPalette(color.toString()));
});

root.add('/theme').get(({ search }) => {
  const color = search.get('color')
  const customs = search.getAll('custom')
  const type = search.get('type')

  if (typeof color !== "string" || isHexString(color) === false) {
    return Response.json(colorError(color), { status: 400 });
  }

  const palette = createTheme(color, customs);

  if (type) {
    switch (type) {
      case 'css':
        return new Response(buildCssVariables(palette))
    }
  }

  return Response.json(palette);
});

root.add('/tonal').get(({ search }) => {
  const color = search.get('color');

  if (typeof color !== "string" || isHexString(color) === false) {
    return Response.json(colorError(color), { status: 400 });
  }

  return Response.json(createTonalPalette(color));
});

root.get(async ({ path }) => {
  const isHome = path === "/";

  if (isHome) {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
  }

  return Response.json({
    msg: "Not found",
    endpoints: ["/neutral", "/theme", "/tonal"],
  }, { status: 404 });
});

export default root