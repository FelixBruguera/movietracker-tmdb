import { Hono } from "hono"
import { getRatingsByDecade } from "./queries"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "../../../db/schema"

const app = new Hono().basePath("/stats")

app.get("/reviews/movies", async (c) => {
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  console.log(id)
  const result = await getRatingsByDecade(db, id)
  console.log(result)
  return c.json(result)
})

export default app
