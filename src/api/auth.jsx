import { auth } from "../../lib/auth.server"
import { Hono } from "hono"
import { serve } from "@hono/node-server"

const app = new Hono()

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw)
})

serve(app)
