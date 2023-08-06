export interface ParsedRequest {
  path: string
  params: Record<string, string | undefined> | undefined
  query: { [name: string]: string | string[] }
}

export type RouteMethodHandler = (
  parsedRequest: ParsedRequest,
  req: Request,
  info: Deno.ServeHandlerInfo,
) => Promise<Response> | Response

export class Route {
  path?: string
  pattern: URLPattern
  #handler: Map<string, RouteMethodHandler>
  #routes: Set<Route>

  constructor(path: string = '/') {
    this.path = path
    this.pattern = new URLPattern({ pathname: path })
    this.#handler = new Map()
    this.#routes = new Set()

    this.#handler.set('OPTIONS', () => {
      const methods = this.#handler.keys()

      return new Response(null, {
        headers: {
          Allow: [...methods].join(', '),
        },
      })
    })
  }

  get endpoints(): string[] {
    const endpoints = this.path ? [this.path] : []
    const children = [...this.#routes].map((route) => route.endpoints)

    for (const child of children) {
      endpoints.push(...child)
    }

    return endpoints
  }

  get handle() {
    return this.#exec.bind(this)
  }

  #parseRequest(url: URL | string): ParsedRequest {
    if (typeof url === 'string') {
      url = new URL(url)
    }

    const path = url.pathname
    const params = this.pattern.exec(url)?.pathname.groups
    const search = new URLSearchParams(url.search)
    const query: ParsedRequest['query'] = {}

    for (const key of search.keys()) {
      const values = search.getAll(key)

      if (values.length > 0) {
        query[key] = values.length > 1 ? values : values.join()
      }
    }

    return { params, path, query }
  }

  async #exec(
    req: Request,
    info: Deno.ServeHandlerInfo,
    url?: URL,
  ): Promise<Response> {
    if (!url) {
      url = new URL(req.url)
    }

    if (this.pattern.test(url)) {
      const parsedRequest = this.#parseRequest(url)
      const method = req.method
      const handler = this.#handler.get(method)

      if (handler) {
        return await handler(parsedRequest, req, info)
      }
    }

    for (const route of this.#routes) {
      if (route.canHandle(url, req.method)) {
        return await route.handle(req, info, url)
      }
    }

    return new Response(
      JSON.stringify({
        status: 404,
        msg: `Can't handle request for path '${new URL(req.url).pathname}'`,
      }),
      { status: 404 },
    )
  }

  canHandle(url: URL, method: string): boolean {
    const isMatch = this.pattern.test(url)

    if (isMatch) {
      return this.#handler.has(method)
    }

    for (const route of this.#routes) {
      if (route.canHandle(url, method)) {
        return true
      }
    }

    return false
  }

  add(path: string): Route {
    path = (path.startsWith('/') ? path : `/${path}`).replace(/^\/+/, '/')
    const routePath = this.path === '/' ? path : `${this.path}${path}`
    const route = new Route(routePath)

    for (const subroute of this.#routes) {
      if (subroute.path === path) {
        return route
      }
    }

    this.#routes.add(route)
    return route
  }

  get(handler: RouteMethodHandler): Route {
    this.#handler.set('GET', handler)
    return this
  }

  post(handler: RouteMethodHandler): Route {
    this.#handler.set('POST', handler)
    return this
  }

  patch(handler: RouteMethodHandler): Route {
    this.#handler.set('PATCH', handler)
    return this
  }

  delete(handler: RouteMethodHandler): Route {
    this.#handler.set('DELETE', handler)
    return this
  }

  put(handler: RouteMethodHandler): Route {
    this.#handler.set('PUT', handler)
    return this
  }

  options(handler: RouteMethodHandler): Route {
    this.#handler.set('OPTIONS', handler)
    return this
  }

  connect(handler: RouteMethodHandler): Route {
    this.#handler.set('CONNECT', handler)
    return this
  }

  trace(handler: RouteMethodHandler): Route {
    this.#handler.set('TRACE', handler)
    return this
  }
}
