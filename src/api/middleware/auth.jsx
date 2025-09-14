import { getAuth } from "../../../lib/auth.server"
import { HTTPException } from "hono/http-exception"

const auth = async (c, next) => {
  const session = await getAuth(c.env.DB).api.getSession({
    headers: c.req.header(),
  })
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }
  c.set("session", session)
  await next()
}

export default auth
