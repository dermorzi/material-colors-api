import { ParsedRequest, Route } from 'libs'
import { createTheme } from 'material'
import { CSSGenerator, LessGenerator, SASSGenerator, SCSSGenerator, StylusGenerator } from 'generators'

export const root = new Route('/')

function requestTheme(query: ParsedRequest['query']) {
  const theme = createTheme(query)

  const target = query.target && typeof query.target === 'string'
    ? query.target
    : Array.isArray(query.target) ? query.target[0] : 'hex'

  return { theme, target }
}

root.add('/theme.json').get(({ query }) => {
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
  const { theme, target } = requestTheme(query)

  if (theme instanceof Error) {
    const { message } = theme as Error
    return new Response(message, { status: 400 })
  }

  const gen = new CSSGenerator(theme, target, query?.prefix)

  return new Response(gen.build())
})

root.add('/theme.scss').get(({ query }) => {
  const { theme, target } = requestTheme(query)

  if (theme instanceof Error) {
    const { message } = theme as Error
    return new Response(message, { status: 400 })
  }

  const gen = new SCSSGenerator(theme, target, query?.prefix)

  return new Response(gen.build())
})

root.add('/theme.sass').get(({ query }) => {
  const { theme, target } = requestTheme(query)

  if (theme instanceof Error) {
    const { message } = theme as Error
    return new Response(message, { status: 400 })
  }

  const gen = new SASSGenerator(theme, target, query?.prefix)

  return new Response(gen.build())
})

root.add('/theme.less').get(({ query }) => {
  const { theme, target } = requestTheme(query)

  if (theme instanceof Error) {
    const { message } = theme as Error
    return new Response(message, { status: 400 })
  }

  const gen = new LessGenerator(theme, target, query?.prefix)

  return new Response(gen.build())
})

root.add('/theme.stylus').get(({ query }) => {
  const { theme, target } = requestTheme(query)

  if (theme instanceof Error) {
    const { message } = theme as Error
    return new Response(message, { status: 400 })
  }

  const gen = new StylusGenerator(theme, target, query?.prefix)

  return new Response(gen.build())
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
