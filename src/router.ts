import { Route } from 'libs'
import { createTheme } from 'material'
import CSSGenerator from './generators/css.ts'

export const root = new Route('/')

root.add('/theme').get(({ query }) => {
  const theme = createTheme(query)

  if (theme instanceof Error) {
    const { message, name } = theme as Error
    return Response.json({
      type: name,
      msg: message
    }, { status: 400 })
  }

  return Response.json(theme)
})

root.add('/theme.css').get(({ query }) => {
  const theme = createTheme(query)

  if (theme instanceof Error) {
    const { message } = theme as Error
    return new Response(message, { status: 400 })
  }

  const target = query.target && typeof query.target === 'string'
    ? query.target
    : Array.isArray(query.target) ? query.target[0] : 'hex'

  return new Response(CSSGenerator(theme, target))
})

root.get(async ({ path }) => {
  const isHome = path === '/'

  if (isHome) {
    const html = await Deno.readTextFile('./views/index.html')
    return new Response(html, { headers: { 'Content-Type': 'text/html' } })
  }

  return Response.json({
    msg: 'Not found',
    endpoints: ['/neutral', '/theme', '/tonal'],
  }, { status: 404 })
})

export default root
