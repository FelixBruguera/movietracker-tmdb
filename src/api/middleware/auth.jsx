import { getAuth } from "../../../lib/auth.server"
import { HTTPException } from "hono/http-exception"

const auth = async (c, next) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  if (!session) {
    return c.json(JSON.stringify({ message: "Unauthorized" }), 401)
  }
  c.set("session", session)
  await next()
}

export default auth
