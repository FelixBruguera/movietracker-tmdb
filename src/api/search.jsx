import { Hono } from "hono"
import axios from "axios"
import tvSchema from "../utils/tvSchema"
import { createCacheKey } from "../utils/createCacheKey"
import stableStringify from "json-stable-stringify"
import { z } from "zod"

const app = new Hono().basePath("/api/search")
const hourToSeconds = 3600
const searchSchema = z.object({
  query: z.string().min(3).max(100),
  include_adult: z.literal(false),
  language: z.literal("en-US"),
})

app.get("/", async (c) => {
  const query = c.req.query()
  query.include_adult = false
  query.language = "en-US"
  const parsedQuery = searchSchema.parse(query)
  const queryKey = await createCacheKey(stableStringify(parsedQuery))
  const key = `search_${queryKey}`
  const cacheHit = await c.env.KV.get(key, { type: "json" })
  if (cacheHit) {
    console.log(`cache response`)
    return c.json(cacheHit)
  } else {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi`,
      {
        params: { ...parsedQuery },
        headers: `Authorization: Bearer ${c.env.TMDB_TOKEN}`,
      },
    )
    console.log(response.request)
    await c.env.KV.put(key, JSON.stringify(response.data), {
      expirationTtl: hourToSeconds * 12,
    })
    return c.json(response.data)
  }
})

export default app
