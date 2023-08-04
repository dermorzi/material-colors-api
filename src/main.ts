import loadEnv from './lib/env.ts'
import router from './router.ts'

await loadEnv()

const port = Number(Deno.env.get("PORT") || 8080);
Deno.serve({ port }, router.handle)
