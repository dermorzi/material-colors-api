import { LoadEnvFile } from 'libs'
import router from './router.ts'

await LoadEnvFile()

const port = Number(Deno.env.get('PORT') || 8080)
Deno.serve({ port }, router.handle)
