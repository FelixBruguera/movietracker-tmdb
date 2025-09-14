import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import { searches } from "../db/schema"
import { eq, sql, and } from "drizzle-orm"
import * as schema from "../db/schema"
import {
  searchQuerySchema,
  searchQuerySchemaTV,
  searchSchema,
} from "../utils/searchSchema"
import { HTTPException } from "hono/http-exception"
import auth from "./middleware/auth"

const app = new Hono().basePath("/api/user")
app.use(auth)

app.get("/searches", async (c) => {
  const session = c.get("session")
  const db = drizzle(c.env.DB, { schema: schema })
  const searchList = await db
    .select({
      id: searches.id,
      search: searches.search,
      path: searches.path,
      name: searches.name,
    })
    .from(searches)
    .where(eq(session.user.id, searches.userId))
  return c.json(searchList)
})

app.post("/searches", async (c) => {
  const session = c.get("session")
  const body = await c.req.json()
  console.log(body)
  const parsedBody = searchSchema.parse(body)
  const query = c.req.query()
  console.log(query, query.include_adult)
  const parsedQuery = parsedBody.path.includes("tv")
    ? searchQuerySchemaTV.parse(query)
    : searchQuerySchema.parse(query)
  parsedQuery.search = parsedBody.name
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await db
      .insert(searches)
      .values({
        name: parsedBody.name,
        path: parsedBody.path,
        search: parsedQuery,
        userId: session.user.id,
      })
      .returning({
        id: searches.id,
        name: searches.name,
        search: searches.search,
        path: searches.path,
      })
    return c.json(result)
  } catch (e) {
    console.log(e.cause.message)
    if (e.cause.message.includes("UNIQUE constraint failed")) {
      throw new HTTPException(400, { message: "Search name must be unique" })
    } else {
      throw new HTTPException(500)
    }
  }
})

app.patch("/searches/:id", async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const body = await c.req.json()
  const { name } = searchSchema.parse(body)
  const db = drizzle(c.env.DB, { schema: schema })
  try {
    const result = await db
      .update(searches)
      .set({ name: name, search: sql`json_set(search, '$.search', ${name})` })
      .where(and(eq(searches.id, id), eq(searches.userId, session.user.id)))
      .returning({
        id: searches.id,
        name: searches.name,
        search: searches.search,
        path: searches.path,
      })
    if (result.length > 0) {
      return c.json(result[0])
    } else {
      return c.newResponse(null, 404)
    }
  } catch (e) {
    console.log(e.cause.message)
    if (e.cause.message.includes("UNIQUE constraint failed")) {
      throw new HTTPException(400, { message: "Search name must be unique" })
    } else {
      throw new HTTPException(500)
    }
  }
})

app.delete("/searches/:id", async (c) => {
  const session = c.get("session")
  const id = c.req.param("id")
  const db = drizzle(c.env.DB, { schema: schema })
  const result = await db
    .delete(searches)
    .where(and(eq(searches.id, id), eq(searches.userId, session.user.id)))
  console.log(result)
  if (result.meta.changes > 0) {
    return c.newResponse(null, 204)
  } else {
    console.log(result)
    throw new HTTPException(404)
  }
})

export default app
